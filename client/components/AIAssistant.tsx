"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import CharacterArt, { CharacterState } from "@/components/CharacterArt";
import EmailDraftCard, { EmailDraft } from "@/components/EmailDraftCard";
import { portfolioData } from "@/data/portfolioData";
import { API_ROUTES } from "@/lib/constants";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  toolUsed?: string;
  draft?: EmailDraft;
  timestamp: string;
}

const STATE_NAMES: Record<CharacterState, { label: string; icon: string }> = {
  idle: { label: "Ready", icon: "sparkles" },
  thinking: { label: "Thinking", icon: "bulb-outline" },
  searching: { label: "Searching", icon: "search-outline" },
  coding: { label: "Coding", icon: "code-slash-outline" },
  envelope: { label: "Drafting", icon: "mail-outline" },
  error: { label: "Alert", icon: "alert-circle-outline" },
};

const MARKDOWN_COMPONENTS = {
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
    const isSafe = href && (href.startsWith("https://") || href.startsWith("http://") || href.startsWith("mailto:"));
    return (
      <a
        href={isSafe ? href : "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="ai-chat-link"
      >
        {children}
      </a>
    );
  },
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="ai-chat-strong">{children}</strong>
  ),
  code: ({ children }: { children?: React.ReactNode }) => (
    <code className="ai-chat-code">{children}</code>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="ai-chat-ul">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="ai-chat-ol">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="ai-chat-li">{children}</li>
  ),
  h1: ({ children }: { children?: React.ReactNode }) => <h4 className="ai-content-h4">{children}</h4>,
  h2: ({ children }: { children?: React.ReactNode }) => <h4 className="ai-content-h4">{children}</h4>,
  h3: ({ children }: { children?: React.ReactNode }) => <h4 className="ai-content-h4">{children}</h4>,
  p: ({ children }: { children?: React.ReactNode }) => <p className="ai-chat-p">{children}</p>,
};

export default function AIAssistant() {
  const [characterState, setCharacterState] = useState<CharacterState>("idle");
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const { profile, portfolio, resume } = portfolioData;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content:
        `Hello! I am **${profile.name}'s AI Assistant**.\n\nAsk me about his projects, technical stack, or draft an email directly to him!`,
      timestamp: "Just now",
    },
  ]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [pendingDraft, setPendingDraft] = useState<EmailDraft | null>(null);
  const poseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch(API_ROUTES.HEALTH).catch(() => {});
  }, []);

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isTyping) return;

    if (poseTimer.current) clearTimeout(poseTimer.current);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages: Message[] = [...messages, userMessage];
    setMessages([...newMessages, {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);

    setIsTyping(true);
    setCharacterState("thinking");

    let currentReply = "";
    let activeTool: string | undefined = undefined;
    let sawError = false;

    const setLatestAssistantReply = (content: string, tool?: string, draft?: EmailDraft) => {
      setMessages((prev) => {
        const next = [...prev];
        const lastIdx = next.length - 1;
        if (lastIdx >= 0 && next[lastIdx].role === "assistant") {
          next[lastIdx] = {
            ...next[lastIdx],
            content,
            toolUsed: tool ?? next[lastIdx].toolUsed,
            draft: draft ?? next[lastIdx].draft,
          };
        }
        return next;
      });
    };

    try {
      const historyPayload = newMessages
        .filter((m) => m.content.trim() !== "")
        .map((m) => ({ role: m.role, content: m.content }))
        .slice(-40);

      const response = await fetch(API_ROUTES.CHAT_STREAM, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: historyPayload,
          pending_action: pendingDraft,
          conversation_id: conversationId,
        }),
      });

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Stream connection failed");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          const line = part.split("\n").find((l) => l.startsWith("data: "));
          if (!line) continue;

          try {
            const event = JSON.parse(line.slice(6));

            if (event.type === "tool_start") {
              activeTool = event.tool;
              if (event.tool === "portfolio_search") {
                setCharacterState("searching");
              } else if (event.tool === "github_repo_info") {
                setCharacterState("coding");
              } else if (event.tool === "draft_contact_email" || event.tool === "send_contact_email") {
                setCharacterState("envelope");
              } else {
                setCharacterState("thinking");
              }
              setLatestAssistantReply(currentReply, activeTool);
            } else if (event.type === "token") {
              currentReply += event.text;
              setLatestAssistantReply(currentReply, activeTool);
            } else if (event.type === "error") {
              sawError = true;
              currentReply = event.message || "An error occurred.";
              setLatestAssistantReply(currentReply, activeTool);
              setCharacterState("error");
              if (poseTimer.current) clearTimeout(poseTimer.current);
              poseTimer.current = setTimeout(() => setCharacterState("idle"), 2000);
            } else if (event.type === "done") {
              if (event.reply) currentReply = event.reply;
              if (event.conversation_id) setConversationId(event.conversation_id);
              if (event.error) sawError = true;

              const draftData = event.pending_action || undefined;
              if (!event.error) {
                setPendingDraft(draftData ?? null);
              }

              setLatestAssistantReply(currentReply, activeTool, draftData);

              if (poseTimer.current) clearTimeout(poseTimer.current);

              if (sawError) {
                setCharacterState("error");
                poseTimer.current = setTimeout(() => setCharacterState("idle"), 2000);
              } else if (draftData) {
                setCharacterState("envelope");
              } else {
                poseTimer.current = setTimeout(() => setCharacterState("idle"), 1800);
              }
            }
          } catch {

          }
        }
      }
    } catch {
      sawError = true;
      setLatestAssistantReply(
        "Daily AI token limit reached or connection interrupted. Please explore Vivek's detailed projects, skills, and background in the sections below, or send a direct message via the Contact tab!"
      );
      setCharacterState("error");
      poseTimer.current = setTimeout(() => setCharacterState("idle"), 2500);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text || isTyping) return;
    setInput("");
    sendMessage(text);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const handleReset = () => {
    setCharacterState("idle");
    setIsTyping(false);
    setConversationId(null);
    setPendingDraft(null);
    setMessages([
      {
        id: "welcome-1",
        role: "assistant",
        content:
          `Conversation reset. Ask me anything about ${profile.name}'s projects, technical stack, or send a message!`,
        timestamp: "Just now",
      },
    ]);
  };

  return (
    <section className="ai-assistant-top-block">
      <div className="ai-top-card">

        <div className="ai-visualizer-column">
          <div className="ai-col-header">
            <div className="icon-box ai-icon-box">
              <ion-icon name="sparkles-outline"></ion-icon>
            </div>
            <div className="ai-col-title-wrap">
              <h2 className="h4 ai-col-title">{portfolioData.aiAssistant.title}</h2>
              <div className="ai-col-status">
                <span className={`status-dot state-${characterState}`}></span>
                <span className="status-text">{STATE_NAMES[characterState].label}</span>
              </div>
            </div>
          </div>

          <div className="ai-bot-stage-wrapper">
            <CharacterArt state={characterState} />
          </div>

          <div className="ai-assistant-desc-box">
            <p className="ai-assistant-desc-text">
              {portfolioData.aiAssistant.description}
            </p>
          </div>
        </div>

        <div className="ai-conversation-column">
          <div className="ai-chat-header">
            <div className="chat-header-title-wrap">
              <span className="chat-header-sparkle">
                <ion-icon name="sparkles"></ion-icon>
              </span>
              <h3 className="h5 chat-header-title">Live Chat</h3>
            </div>
            <button
              type="button"
              className="chat-reset-btn"
              onClick={handleReset}
              title="Reset conversation"
            >
              <ion-icon name="refresh-outline"></ion-icon>
              <span>Reset</span>
            </button>
          </div>

          <div
            ref={chatScrollRef}
            className="ai-chat-messages custom-chat-scrollbar"
            role="log"
            aria-live="polite"
            aria-label="Conversation history"
          >
            {messages.map((msg) => (
              <div key={msg.id} className={`ai-message-row ${msg.role}`}>
                {msg.role === "assistant" && (
                  <div className="ai-msg-avatar-icon">
                    <ion-icon name="sparkles"></ion-icon>
                  </div>
                )}

                <div className="ai-message-bubble">
                  {msg.toolUsed && (
                    <div className="ai-tool-pill">
                      <ion-icon
                        name={
                          msg.toolUsed === "portfolio_search"
                            ? "search-outline"
                            : msg.toolUsed === "github_repo_info"
                            ? "code-slash-outline"
                            : "mail-outline"
                        }
                      ></ion-icon>
                      <span>Tool: {msg.toolUsed}</span>
                    </div>
                  )}

                  {msg.content && msg.content.trim() ? (
                    <div className="ai-msg-text markdown-content">
                      <ReactMarkdown components={MARKDOWN_COMPONENTS}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="typing-dots" aria-label="Assistant is thinking">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  )}

                  {msg.draft && (
                    <EmailDraftCard
                      draft={msg.draft}
                      onSend={() => {
                        sendMessage("Yes, please send it");
                      }}
                      onCancel={() => {
                        sendMessage("No, cancel it");
                      }}
                    />
                  )}

                  <span className="ai-msg-time">{msg.timestamp}</span>
                </div>
              </div>
            ))}
          </div>

          <form className="ai-chat-input-form" onSubmit={handleSubmit}>
            <div className="ai-chat-input-wrapper">
              <input
                type="text"
                className="ai-chat-input-field"
                placeholder={`Ask something about ${profile.name}'s projects, experience...`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping}
              />
              <button
                type="submit"
                className="ai-chat-send-btn"
                disabled={!input.trim() || isTyping}
                aria-label="Send message"
              >
                <ion-icon name="paper-plane"></ion-icon>
                <span>Send</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
