"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Character } from "@/components/Character";
import { ChatPanel } from "@/components/ChatPanel";
import { useChat } from "@/lib/chat-context";

/**
 * The chat bubble that follows the visitor down the page.
 *
 * It only appears once the hero chat has scrolled out of sight — showing both at
 * once would be two copies of the same conversation on screen. They share state,
 * so scrolling away mid-conversation and reopening here picks up exactly where
 * it left off.
 */
export function FloatingChat() {
  const { characterState, isThinking } = useChat();
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;

    // IntersectionObserver rather than a scroll listener — the browser does the
    // work, so nothing runs on every pixel of scroll. Show the widget only once
    // the hero chat has left the viewport, since two copies of the same
    // conversation on screen at once would be confusing.
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // Close on Escape, which is what people expect from anything overlaying a page.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          // Explicit and short. The default spring takes long enough to settle
          // that the widget looks like it's lingering after scrolling back up.
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3"
        >
          {/* Its own AnimatePresence. The outer one is keyed on isVisible, so
              without this the panel would unmount instantly on close and the
              exit animation below would never run. */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                // Capped by viewport width so it can't overflow on a small phone.
                className="w-[min(22rem,calc(100vw-2.5rem))]"
              >
                <ChatPanel />
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close chat" : "Open chat"}
            className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-surface shadow-xl transition hover:border-accent"
          >
            {isOpen ? (
              <span className="text-xl leading-none text-muted" aria-hidden>
                ×
              </span>
            ) : (
              <span className="relative">
                <Character state={characterState} showCaption={false} className="w-12" />
                {/* A quiet pulse while it's working, so a visitor who scrolled away
                    can see their answer is on its way. */}
                {isThinking && (
                  <span className="absolute right-0 top-0 h-2.5 w-2.5 animate-pulse rounded-full bg-accent" />
                )}
              </span>
            )}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
