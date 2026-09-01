"use client";

import React from "react";
import { useTheme } from "./ThemeContext";

interface ThemeSwitchProps {
  className?: string;
}

export default function ThemeSwitch({ className = "" }: ThemeSwitchProps) {
  const { themeMode, toggleThemeMode } = useTheme();
  const isDark = themeMode === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      onClick={toggleThemeMode}
      className={`theme-pill-switch ${isDark ? "dark-active" : "light-active"} ${className}`}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <span className="switch-track">
        <span className="switch-knob">
          {isDark ? (
            /* Crescent Moon Outline matching Image 1 Dark Mode */
            <svg
              className="switch-icon moon-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            /* Sun Outline with rays matching Image 1 Light Mode */
            <svg
              className="switch-icon sun-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <line x1="12" y1="2" x2="12" y2="5" />
              <line x1="12" y1="19" x2="12" y2="22" />
              <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
              <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
              <line x1="2" y1="12" x2="5" y2="12" />
              <line x1="19" y1="12" x2="22" y2="12" />
              <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
              <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
            </svg>
          )}
        </span>
      </span>
    </button>
  );
}
