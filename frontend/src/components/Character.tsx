"use client";

import { motion } from "framer-motion";
import { CharacterArt } from "@/components/CharacterArt";
import type { CharacterState } from "@/lib/types";

/** Short line shown under the character so the state is readable, not just visual. */
const CAPTION: Record<CharacterState, string> = {
  idle: "Ask me anything",
  thinking: "Thinking…",
  searching: "Searching the portfolio…",
  coding: "Reading the repo…",
  envelope: "Draft ready",
  error: "Something went wrong",
};

interface CharacterProps {
  state: CharacterState;
  /** Hide the caption when the character is small, e.g. in the floating widget. */
  showCaption?: boolean;
  className?: string;
}

export function Character({ state, showCaption = true, className = "" }: CharacterProps) {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <motion.div
        className="w-full max-w-[280px]"
        // Gentle bob so the character feels alive while idle. Speeds up slightly
        // when thinking, which reads as concentration.
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: state === "thinking" ? 1.4 : 3.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* key={state} restarts the fade whenever the pose changes, so switching
            between poses is a soft cross-fade rather than an instant snap. */}
        <motion.div
          key={state}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
        >
          <CharacterArt state={state} />
        </motion.div>
      </motion.div>

      {showCaption && (
        <motion.p
          key={`caption-${state}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted"
          // Screen readers announce the change without the user needing to see it.
          aria-live="polite"
        >
          {CAPTION[state]}
        </motion.p>
      )}
    </div>
  );
}
