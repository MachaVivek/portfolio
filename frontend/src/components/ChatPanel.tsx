"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { EmailDraftCard } from "@/components/EmailDraftCard";
import { profile, projects } from "@/data/portfolio";
import { MAX_CHARS, useChat } from "@/lib/chat-context";

/** Starter suggestions, one per thing the agent can actually do. */
const STARTERS = [
  projects[0]?.askPrompt ?? "Tell me about your projects",
  projects[1]?.askPrompt ?? "Explain one of your repos",
  `I'd like to contact ${profile.name.split(" ")[0]}`,
];

/** The three dots shown while waiting for a reply. */
function TypingDots() {
  return (
    <div className="flex gap-1 px-1 py-2" aria-label="Assistant is typing">
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted"
          style={{ animationDelay: `${index * 0.15}s` }}
        />
      ))}
    </div>
  );
}

export function ChatPanel() {
  const { messages, isThinking, isWaking, pendingAction, sendMessage } = useChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep the newest thing in view as the conversation grows. pendingAction is in
  // here too — the draft card appears below the last message, so without it the
  // Send and Cancel buttons can sit below the fold unnoticed.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isThinking, pendingAction]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const text = input;
    setInput("");
    void sendMessage(text);
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-[460px] w-full flex-col rounded-2xl border border-border bg-surface shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-5 py-3">
        <span className="h-2 w-2 rounded-full bg-accent" />
        <p className="text-sm font-medium">Portfolio Assistant</p>
      </div>

      {/* Messages. Centred while empty; a bottom-anchored scrolling list once
          the conversation starts. */}
      <div
        ref={scrollRef}
        className={`flex flex-1 flex-col gap-4 overflow-y-auto p-5 ${
          isEmpty ? "items-center justify-center text-center" : ""
        }`}
      >
        {isEmpty ? (
          <>
            <p className="max-w-sm text-sm text-muted">
              Hi! Ask me about {profile.name.split(" ")[0]}&apos;s projects, dig into a
              GitHub repo, or send a message.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {STARTERS.map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => void sendMessage(starter)}
                  className="rounded-full border border-border bg-accent-soft px-3 py-1.5 text-xs text-foreground transition hover:border-accent"
                >
                  {starter}
                </button>
              ))}
            </div>
          </>
        ) : (
          messages.map((message, index) => {
            // An assistant bubble with no text yet is the placeholder the reply
            // streams into — show the typing dots there instead of an empty box.
            const isStreamingInto =
              message.role === "assistant" && !message.content && isThinking;

            return (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-accent text-background"
                      : "bg-accent-soft text-foreground"
                  }`}
                >
                  {isStreamingInto ? (
                    <TypingDots />
                  ) : message.role === "assistant" ? (
                    // Replies come back as markdown — GitHub answers have headings,
                    // lists and code blocks that would look wrong as plain text.
                    <div className="prose-chat space-y-2">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Only shown once the wait is long enough to look broken, so the visitor
            knows it's starting up rather than frozen. */}
        {isWaking && (
          <p className="text-center text-xs text-muted" aria-live="polite">
            Waking the server up — this can take up to a minute on the free tier.
          </p>
        )}

        {/* The draft preview, with real Send / Cancel buttons. */}
        {pendingAction && !isThinking && (
          <EmailDraftCard
            draft={pendingAction}
            disabled={isThinking}
            onRespond={(answer) => void sendMessage(answer)}
          />
        )}
      </div>

      {/* Input */}
      <form className="flex items-center gap-2 border-t border-border p-3" onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value.slice(0, MAX_CHARS))}
          placeholder="Ask something..."
          aria-label="Message"
          disabled={isThinking}
          className="flex-1 rounded-lg bg-background px-3 py-2 text-sm outline-none ring-1 ring-border focus:ring-accent disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={!input.trim() || isThinking}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background transition disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}
