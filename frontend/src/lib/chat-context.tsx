"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  CharacterState,
  ChatMessage,
  EmailDraft,
  StreamEvent,
} from "@/lib/types";
import { TOOL_TO_STATE } from "@/lib/types";

/**
 * The one place chat state lives.
 *
 * It's a context rather than local state because the hero chat and the floating
 * widget are two views of the *same* conversation — a visitor who asks something
 * at the top of the page and scrolls down shouldn't lose it.
 */

/** Matches the backend's max_message_length, so we stop it before the API 400s. */
export const MAX_CHARS = 2000;

/** How long a tool pose lingers after the work finishes, in ms. */
const POSE_HOLD_MS = 1800;

/** If nothing has arrived after this long, the server is probably asleep. */
const WAKING_AFTER_MS = 4000;

/**
 * How many past messages to send with each request.
 *
 * The backend rejects anything over 50 outright, and every failed attempt adds
 * two more messages — so without a cap a long conversation would hit the limit
 * and then be permanently stuck, with no way back except a page refresh. Sending
 * the most recent slice keeps it working; the assistant just loses the oldest
 * context, which is a far better outcome than a dead chat.
 */
const MAX_HISTORY = 40;

interface ChatContextValue {
  messages: ChatMessage[];
  characterState: CharacterState;
  pendingAction: EmailDraft | null;
  isThinking: boolean;
  /** True when the backend is slow to respond and is likely cold-starting. */
  isWaking: boolean;
  sendMessage: (text: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextValue | null>(null);

/** Split a raw stream into complete Server-Sent Events. */
function parseEvents(buffer: string): { events: StreamEvent[]; rest: string } {
  const events: StreamEvent[] = [];
  // A blank line marks the end of an event. Whatever follows the last one is an
  // incomplete event, so it's kept for the next chunk.
  const parts = buffer.split("\n\n");
  const rest = parts.pop() ?? "";

  for (const part of parts) {
    const line = part.split("\n").find((l) => l.startsWith("data: "));
    if (!line) continue;
    try {
      events.push(JSON.parse(line.slice(6)) as StreamEvent);
    } catch {
      // A malformed event shouldn't kill the whole stream.
    }
  }
  return { events, rest };
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pendingAction, setPendingAction] = useState<EmailDraft | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [isWaking, setIsWaking] = useState(false);
  const [characterState, setCharacterState] = useState<CharacterState>("idle");

  const poseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Wake the backend as soon as someone lands on the page. On Render's free tier
  // it sleeps after ~15 minutes idle and takes 30-60s to start, so kicking it off
  // now means it's usually ready by the time anyone types.
  useEffect(() => {
    fetch("/api/health").catch(() => {
      // Nothing to do if it fails — this is only a head start, not a requirement.
    });
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim().slice(0, MAX_CHARS);
      if (!trimmed || isThinking) return;

      if (poseTimer.current) clearTimeout(poseTimer.current);

      // Show the visitor's message straight away, plus an empty assistant bubble
      // for the reply to fill into as it streams.
      const history: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
      setMessages([...history, { role: "assistant", content: "" }]);
      setIsThinking(true);
      setCharacterState("thinking");

      const wakingTimer = setTimeout(() => setIsWaking(true), WAKING_AFTER_MS);

      /** Replace the assistant bubble at the end of the list. */
      const setReply = (content: string) =>
        setMessages([...history, { role: "assistant", content }]);

      let reply = "";
      let sawError = false;

      try {
        const response = await fetch("/api/chat/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // The recent history every time — the backend keeps no memory.
            messages: history.slice(-MAX_HISTORY),
            // Echoed back untouched; it's signed, so any edit invalidates it.
            pending_action: pendingAction,
            conversation_id: conversationId,
          }),
        });

        const reader = response.body?.getReader();
        if (!reader) throw new Error("no stream");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          clearTimeout(wakingTimer);
          setIsWaking(false);

          buffer += decoder.decode(value, { stream: true });
          const { events, rest } = parseEvents(buffer);
          buffer = rest;

          for (const event of events) {
            if (event.type === "tool_start") {
              // The pose changes while the tool is running, not after.
              setCharacterState(TOOL_TO_STATE[event.tool] ?? "thinking");
            } else if (event.type === "token") {
              reply += event.text;
              setReply(reply);
            } else if (event.type === "error") {
              sawError = true;
              setReply(event.message);
              // The pose is reset here too, not just in "done". A stream can end
              // on an error with no "done" following it, and without this the
              // character would sit on "Reading the repo…" indefinitely.
              setCharacterState("error");
              if (poseTimer.current) clearTimeout(poseTimer.current);
              poseTimer.current = setTimeout(() => setCharacterState("idle"), POSE_HOLD_MS);
            } else if (event.type === "done") {
              // The backend's final text wins — it's the authoritative version,
              // and for non-streamed replies it's the only text we get.
              if (event.reply) setReply(event.reply);
              if (event.conversation_id) setConversationId(event.conversation_id);
              if (event.error) sawError = true;

              // Only touch the draft when this is a real backend reply. Our own
              // proxy synthesises a "done" with pending_action: null when it
              // can't reach the server — applying that would silently destroy a
              // draft the visitor was midway through confirming, and there'd be
              // nothing left to retry with.
              if (!event.error) setPendingAction(event.pending_action);

              if (poseTimer.current) clearTimeout(poseTimer.current);

              if (sawError) {
                setCharacterState("error");
                poseTimer.current = setTimeout(
                  () => setCharacterState("idle"),
                  POSE_HOLD_MS,
                );
              } else if (event.pending_action) {
                // A waiting draft is a state, not a moment — hold it until resolved.
                setCharacterState("envelope");
              } else {
                poseTimer.current = setTimeout(
                  () => setCharacterState("idle"),
                  POSE_HOLD_MS,
                );
              }
            }
          }
        }
      } catch {
        setReply("Something went wrong. Please try again.");
        setCharacterState("error");
        poseTimer.current = setTimeout(() => setCharacterState("idle"), POSE_HOLD_MS);
      } finally {
        clearTimeout(wakingTimer);
        setIsWaking(false);
        setIsThinking(false);
      }
    },
    [messages, pendingAction, conversationId, isThinking],
  );

  const value = useMemo(
    () => ({ messages, characterState, pendingAction, isThinking, isWaking, sendMessage }),
    [messages, characterState, pendingAction, isThinking, isWaking, sendMessage],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used inside a ChatProvider");
  return context;
}
