"use client";

import React from "react";
import { useTheme, ACCENT_COLORS } from "./ThemeContext";
import ThemeSwitch from "./ThemeSwitch";

export default function ThemeBar() {
  const { accentId, setAccentId, themeMode } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="theme-customizer-bar" aria-label="Theme and color controls">
      {/* Left: Brand / Title */}
      <div className="theme-bar-brand">
        <div className="theme-brand-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="palette-icon"
          >
            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
            <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
            <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
          </svg>
        </div>
        <div className="theme-brand-text">
          <span className="theme-brand-title">Theme Settings</span>
          <span className="theme-brand-subtitle">
            {themeMode === "dark" ? "Dark Mode" : "Light Mode"}
          </span>
        </div>
      </div>

      {/* Right: Accent Colors + Theme Switch */}
      <div className="theme-controls-group">
        {/* Accent Color Swatches */}
        <div className="accent-picker-wrap" role="radiogroup" aria-label="Select accent color">
          <span className="accent-picker-label">Accent:</span>
          <div className="accent-swatches">
            {ACCENT_COLORS.map((color) => {
              const isSelected = mounted ? accentId === color.id : color.id === "yellow";
              return (
                <button
                  key={color.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`${color.name} theme`}
                  title={`${color.name} (${color.primary})`}
                  className={`color-swatch-btn ${isSelected ? "selected" : ""}`}
                  style={{ backgroundColor: color.primary }}
                  onClick={() => setAccentId(color.id)}
                >
                  {isSelected && (
                    <span className="swatch-check-indicator">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="check-svg"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="theme-bar-divider" aria-hidden="true"></div>

        {/* Light/Dark Mode Switch (matching Image 1) */}
        <div className="theme-switch-wrap">
          <ThemeSwitch />
        </div>
      </div>
    </header>
  );
}
