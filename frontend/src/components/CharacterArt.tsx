import type { CharacterState } from "@/lib/types";

/**
 * PLACEHOLDER ARTWORK.
 *
 * This is a simple vector stand-in so the site is complete and testable before
 * the real character art exists. Everything else — the state machine, the
 * animations, the layout — is final and won't need to change.
 *
 * ── To swap in real art ──────────────────────────────────────────────────────
 * 1. Export six images to public/character/:
 *      idle.webp  thinking.webp  searching.webp  coding.webp  envelope.webp  error.webp
 *    (transparent background, ~512x512, each under ~200KB)
 * 2. Replace this whole component body with:
 *
 *      import Image from "next/image";
 *
 *      export function CharacterArt({ state }: { state: CharacterState }) {
 *        return (
 *          <Image
 *            src={`/character/${state}.webp`}
 *            alt=""
 *            width={512}
 *            height={512}
 *            priority={state === "idle"}
 *            className="h-full w-full object-contain"
 *          />
 *        );
 *      }
 *
 * Nothing else in the app needs to change.
 * See SETUP.md "Creating the character" for how to produce the art.
 */

/** Eye shape per state — the cheapest way to make a pose read differently. */
function Eyes({ state }: { state: CharacterState }) {
  if (state === "thinking") {
    // Looking up and away.
    return (
      <>
        <circle cx="86" cy="86" r="5" fill="#0b1120" />
        <circle cx="118" cy="86" r="5" fill="#0b1120" />
      </>
    );
  }
  if (state === "error") {
    // Downcast, apologetic.
    return (
      <>
        <path d="M78 92 q8 -7 16 0" stroke="#0b1120" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M110 92 q8 -7 16 0" stroke="#0b1120" strokeWidth="4" fill="none" strokeLinecap="round" />
      </>
    );
  }
  if (state === "envelope") {
    // Happy closed eyes.
    return (
      <>
        <path d="M78 90 q8 8 16 0" stroke="#0b1120" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M110 90 q8 8 16 0" stroke="#0b1120" strokeWidth="4" fill="none" strokeLinecap="round" />
      </>
    );
  }
  // Default open eyes, with a highlight dot so it doesn't look lifeless.
  return (
    <>
      <ellipse cx="86" cy="90" rx="6" ry="8" fill="#0b1120" />
      <ellipse cx="118" cy="90" rx="6" ry="8" fill="#0b1120" />
      <circle cx="88" cy="87" r="2" fill="#ffffff" />
      <circle cx="120" cy="87" r="2" fill="#ffffff" />
    </>
  );
}

/** A small object held in front of the character, showing what it's working on. */
function Prop({ state }: { state: CharacterState }) {
  if (state === "searching") {
    // Magnifying glass.
    return (
      <g>
        <circle cx="140" cy="140" r="16" fill="none" stroke="#6f8cff" strokeWidth="5" />
        <line x1="152" y1="152" x2="166" y2="166" stroke="#6f8cff" strokeWidth="6" strokeLinecap="round" />
      </g>
    );
  }
  if (state === "coding") {
    // Laptop.
    return (
      <g>
        <rect x="118" y="128" width="46" height="30" rx="3" fill="#23304d" stroke="#6f8cff" strokeWidth="3" />
        <rect x="112" y="158" width="58" height="6" rx="3" fill="#6f8cff" />
        <line x1="126" y1="138" x2="146" y2="138" stroke="#6f8cff" strokeWidth="3" strokeLinecap="round" />
        <line x1="126" y1="146" x2="138" y2="146" stroke="#6f8cff" strokeWidth="3" strokeLinecap="round" />
      </g>
    );
  }
  if (state === "envelope") {
    return (
      <g>
        <rect x="118" y="130" width="48" height="32" rx="3" fill="#e6edf7" stroke="#6f8cff" strokeWidth="3" />
        <path d="M118 132 l24 18 l24 -18" fill="none" stroke="#6f8cff" strokeWidth="3" />
      </g>
    );
  }
  if (state === "thinking") {
    // Thought dots.
    return (
      <g fill="#6f8cff">
        <circle cx="146" cy="66" r="4" opacity="0.5" />
        <circle cx="158" cy="54" r="6" opacity="0.7" />
        <circle cx="172" cy="40" r="8" />
      </g>
    );
  }
  return null;
}

export function CharacterArt({ state }: { state: CharacterState }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className="h-full w-full"
      role="img"
      aria-label="Portfolio assistant character"
    >
      {/* Soft glow behind the character */}
      <circle cx="100" cy="100" r="72" fill="#6f8cff" opacity="0.10" />

      {/* Body */}
      <path d="M62 176 q0 -46 40 -46 q40 0 40 46 z" fill="#6f8cff" opacity="0.85" />

      {/* Head */}
      <circle cx="102" cy="92" r="46" fill="#f3d9c4" />

      {/* Hair */}
      <path d="M56 88 q0 -48 46 -48 q46 0 46 48 q-14 -22 -46 -22 q-32 0 -46 22 z" fill="#2b3a5c" />
      <path d="M56 88 q-4 -14 4 -22 l6 16 z" fill="#2b3a5c" />

      <Eyes state={state} />

      {/* Mouth */}
      <path
        d={state === "error" ? "M94 112 q8 -6 16 0" : "M94 110 q8 8 16 0"}
        stroke="#0b1120"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* Blush */}
      <ellipse cx="72" cy="104" rx="7" ry="4" fill="#e79a9a" opacity="0.55" />
      <ellipse cx="132" cy="104" rx="7" ry="4" fill="#e79a9a" opacity="0.55" />

      <Prop state={state} />
    </svg>
  );
}
