"use client";

export type CharacterState =
  | "idle"
  | "thinking"
  | "searching"
  | "coding"
  | "envelope"
  | "error";

interface CharacterArtProps {
  state: CharacterState;
}

export default function CharacterArt({ state }: CharacterArtProps) {
  return (
    <div className={`avatar-dynamic-stage state-${state}`}>
      {/* 1. Ambient Fluid Aura Glow (Seamless, no borders/box) */}
      <div className={`ambient-fluid-aura state-${state}`}></div>

      {/* 2. State-Specific VFX Overlays */}
      {state === "idle" && (
        <div className="vfx-container vfx-idle">
          <div className="sparkle sp-1">✦</div>
          <div className="sparkle sp-2">✨</div>
          <div className="sparkle sp-3">✦</div>
          <div className="sparkle sp-4">✨</div>
        </div>
      )}

      {state === "thinking" && (
        <div className="vfx-container vfx-thinking">
          {/* Floating ? Symbols of Different Sizes Appearing & Disappearing */}
          <span className="question-symbol qm-1">?</span>
          <span className="question-symbol qm-2">?</span>
          <span className="question-symbol qm-3">?</span>
          <span className="question-symbol qm-4">?</span>
          <span className="question-symbol qm-5">?</span>
          <span className="question-symbol qm-6">?</span>
        </div>
      )}

      {state === "searching" && (
        <div className="vfx-container vfx-searching">
          {/* Holographic Laser Scanline & HUD Search Brackets */}
          <div className="hud-corner top-left"></div>
          <div className="hud-corner top-right"></div>
          <div className="hud-corner bottom-left"></div>
          <div className="hud-corner bottom-right"></div>
          <div className="holo-laser-scanline">
            <span className="laser-dot left"></span>
            <span className="laser-beam"></span>
            <span className="laser-dot right"></span>
          </div>
        </div>
      )}

      {state === "coding" && (
        <div className="vfx-container vfx-coding">
          {/* Cyber Code Glyphs */}
          <span className="code-glyph cg-1">&lt; / &gt;</span>
          <span className="code-glyph cg-2">&#123; &#125;</span>
          <span className="code-glyph cg-3">0101</span>
          <span className="code-glyph cg-4">const</span>
          <span className="code-glyph cg-5">fn()</span>
        </div>
      )}

      {state === "envelope" && (
        <div className="vfx-container vfx-envelope">
          {/* Golden Letter & Radiant Warm Glow */}
          <div className="draft-beacon-wrap">
            <div className="draft-floating-badge">
              <ion-icon name="mail"></ion-icon>
            </div>
          </div>
        </div>
      )}

      {state === "error" && (
        <div className="vfx-container vfx-error">
          <div className="warning-floating-badge">
            <ion-icon name="warning"></ion-icon>
          </div>
        </div>
      )}

      {/* 3. Transparent Character Avatar with Breathing Float Animation */}
      <div className="avatar-figure-container">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/ai-avatar.png"
          alt="AI Assistant"
          className="avatar-cutout-img"
        />
      </div>
    </div>
  );
}
