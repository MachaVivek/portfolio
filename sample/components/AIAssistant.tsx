"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import CharacterArt, { CharacterState } from "@/components/CharacterArt";
import EmailDraftCard, { EmailDraft } from "@/components/EmailDraftCard";

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

export default function AIAssistant() {
  const [characterState, setCharacterState] = useState<CharacterState>("idle");
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content:
        "Hello! I am **Richard's AI Assistant**.\n\nAsk me about his projects, technical stack, or draft an email directly to him!",
      timestamp: "Just now",
    },
  ]);

  // Scroll ONLY internal chat feed without moving the webpage window
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  const simulateResponse = (userQuery: string) => {
    const q = userQuery.toLowerCase();
    setIsTyping(true);

    if (q.includes("project") || q.includes("finance") || q.includes("orizon") || q.includes("work")) {
      setCharacterState("searching");
      setTimeout(() => {
        setIsTyping(false);
        setCharacterState("idle");
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            toolUsed: "portfolio_search",
            content:
              "### 🚀 Featured Projects\n\nRichard has built several production web & mobile applications:\n\n1. **Finance Dashboard** — Real-time fintech analytics suite with automated reporting pipelines.\n2. **Orizon Web Platform** — Next.js high-performance web app with smooth micro-animations.\n3. **Fundo App** — End-to-end design system & interactive mobile user experience.\n4. **Task Manager** — Full-stack workflow optimization tool.\n\nCheck out the portfolio section below for live project details!",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }, 1200);
    } else if (q.includes("tech") || q.includes("stack") || q.includes("repo") || q.includes("github") || q.includes("code")) {
      setCharacterState("coding");
      setTimeout(() => {
        setIsTyping(false);
        setCharacterState("idle");
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            toolUsed: "github_repo_info",
            content:
              "### 🛠️ Architecture & Tech Stack\n\n- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion\n- **Backend**: FastAPI, Gemini 2.5, Qdrant Vector DB, Supabase\n- **DevOps**: Docker, Render, Vercel\n\nAll repositories follow modern best practices with strict typing and responsive design.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }, 1300);
    } else if (q.includes("contact") || q.includes("email") || q.includes("message") || q.includes("hire") || q.includes("reach")) {
      setCharacterState("envelope");
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            toolUsed: "draft_contact_email",
            content:
              "I have drafted an email for you. You can review and confirm to send it below:",
            draft: {
              subject: "Project Inquiry",
              visitor_name: "Portfolio Visitor",
              visitor_email: "visitor@example.com",
              message:
                "Hi Richard,\n\nI was browsing your portfolio and loved your work. I'd love to connect regarding an upcoming opportunity!",
            },
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }, 1100);
    } else if (q.includes("experience") || q.includes("resume") || q.includes("background") || q.includes("career")) {
      setCharacterState("searching");
      setTimeout(() => {
        setIsTyping(false);
        setCharacterState("idle");
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            toolUsed: "portfolio_search",
            content:
              "### 🎓 Career Summary\n\n- **Creative Director** (2015 — Present): Leading design and frontend engineering.\n- **Art Director** (2013 — 2015): Branding and visual systems.\n- **Web Designer** (2010 — 2013): Interactive web design.\n- **Education**: University School of the Arts & New York Academy of Art.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }, 1100);
    } else {
      setCharacterState("thinking");
      setTimeout(() => {
        setIsTyping(false);
        setCharacterState("idle");
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content:
              `I received your message: *"${userQuery}"*.\n\nFeel free to explore the details below (About, Resume, Portfolio, Blog, Contact) or ask me to draft a message to Richard!`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }, 950);
    }
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    simulateResponse(text);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const handleReset = () => {
    setCharacterState("idle");
    setIsTyping(false);
    setMessages([
      {
        id: "welcome-1",
        role: "assistant",
        content:
          "Conversation reset. Ask me anything about Richard's projects, skills, or send a message!",
        timestamp: "Just now",
      },
    ]);
  };

  return (
    <section className="ai-assistant-top-block">
      <div className="ai-top-card">
        {/* Left Side: Animated Avatar Stage */}
        <div className="ai-visualizer-column">
          <div className="ai-col-header">
            <div className="icon-box ai-icon-box">
              <ion-icon name="sparkles-outline"></ion-icon>
            </div>
            <div className="ai-col-title-wrap">
              <h2 className="h4 ai-col-title">AI Assistant</h2>
              <div className="ai-col-status">
                <span className={`status-dot state-${characterState}`}></span>
                <span className="status-text">{STATE_NAMES[characterState].label}</span>
              </div>
            </div>
          </div>

          {/* Animated Avatar Stage */}
          <div className="ai-bot-stage-wrapper">
            <CharacterArt state={characterState} />
          </div>

          {/* Mode Switcher Buttons */}
          <div className="ai-pose-selector-bar">
            <span className="pose-selector-label">State:</span>
            {(["idle", "thinking", "searching", "coding", "envelope", "error"] as CharacterState[]).map(
              (st) => (
                <button
                  key={st}
                  type="button"
                  className={`pose-pill-btn ${characterState === st ? "active" : ""}`}
                  onClick={() => setCharacterState(st)}
                >
                  {STATE_NAMES[st].label}
                </button>
              )
            )}
          </div>
        </div>

        {/* Right Side: Conversation Feed & Input */}
        <div className="ai-conversation-column">
          <div className="ai-chat-header">
            <div className="chat-header-title-wrap">
              <span className="chat-header-sparkle">✨</span>
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

          {/* Chat Messages Feed with wide custom scrollbar and draggable bob */}
          <div
            ref={chatScrollRef}
            className="ai-chat-messages custom-chat-scrollbar"
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

                  <div className="ai-msg-text">
                    {msg.content.split("\n").map((line, i) => {
                      if (line.startsWith("### ")) {
                        return <h4 key={i} className="ai-content-h4">{line.replace("### ", "")}</h4>;
                      }
                      if (line.startsWith("- ")) {
                        return <li key={i} className="ai-content-li">{line.replace("- ", "")}</li>;
                      }
                      if (line.match(/^\d+\.\s/)) {
                        return <li key={i} className="ai-content-li ordered">{line}</li>;
                      }
                      if (!line.trim()) {
                        return <div key={i} className="ai-spacer" />;
                      }
                      return <p key={i}>{line}</p>;
                    })}
                  </div>

                  {msg.draft && (
                    <EmailDraftCard
                      draft={msg.draft}
                      onSend={() => {
                        setCharacterState("envelope");
                      }}
                      onCancel={() => {
                        setCharacterState("idle");
                      }}
                    />
                  )}

                  <span className="ai-msg-time">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="ai-message-row assistant">
                <div className="ai-msg-avatar-icon">
                  <ion-icon name="sparkles"></ion-icon>
                </div>
                <div className="ai-message-bubble typing-bubble">
                  <div className="typing-dots" aria-label="Assistant is thinking">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <form className="ai-chat-input-form" onSubmit={handleSubmit}>
            <div className="ai-chat-input-wrapper">
              <input
                type="text"
                className="ai-chat-input-field"
                placeholder="Ask something about Richard's projects, experience..."
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
