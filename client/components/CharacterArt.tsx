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

      <div className={`ambient-fluid-aura state-${state}`}></div>

      {state === "idle" && (
        <div className="vfx-container vfx-idle">
          <div className="sparkle sp-1">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>
          <div className="sparkle sp-2">
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>
          <div className="sparkle sp-3">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>
          <div className="sparkle sp-4">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>
        </div>
      )}

      {state === "thinking" && (
        <div className="vfx-container vfx-thinking">

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

          <span className="code-glyph cg-1">&lt; / &gt;</span>
          <span className="code-glyph cg-2">&#123; &#125;</span>
          <span className="code-glyph cg-3">0101</span>
          <span className="code-glyph cg-4">const</span>
          <span className="code-glyph cg-5">fn()</span>
        </div>
      )}

      {state === "envelope" && (
        <div className="vfx-container vfx-envelope">

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

      <div className="avatar-figure-container">

        <img
          src="/images/ai-avatar.png"
          alt="AI Assistant"
          className="avatar-cutout-img"
        />
      </div>
    </div>
  );
}
