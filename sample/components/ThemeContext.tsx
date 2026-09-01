"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

export type ThemeMode = "dark" | "light";

export interface AccentThemeOption {
  id: string;
  name: string;
  primary: string; // hex
  secondary: string;
  contrastText: string;
  rgb: string;
  gradient1: string;
  gradient2: string;
  textGradient: string;
  glow: string;
}

export const ACCENT_COLORS: AccentThemeOption[] = [
  {
    id: "yellow",
    name: "Yellow (Default)",
    primary: "#FFDB70",
    secondary: "#E5A93C",
    contrastText: "#111827",
    rgb: "255, 219, 112",
    gradient1:
      "linear-gradient(to bottom right, #ffdb70 0%, rgba(255, 219, 112, 0) 50%)",
    gradient2:
      "linear-gradient(135deg, rgba(255, 219, 112, 0.25) 0%, rgba(229, 169, 60, 0) 60%), hsl(240, 2%, 13%)",
    textGradient: "linear-gradient(to right, #ffdb70, #ffa62b)",
    glow: "rgba(255, 219, 112, 0.4)",
  },
  {
    id: "cyan",
    name: "Cyan",
    primary: "#22D3EE",
    secondary: "#06B6D4",
    contrastText: "#0f172a",
    rgb: "34, 211, 238",
    gradient1:
      "linear-gradient(to bottom right, #22d3ee 0%, rgba(6, 182, 212, 0) 50%)",
    gradient2:
      "linear-gradient(135deg, rgba(34, 211, 238, 0.25) 0%, rgba(6, 182, 212, 0) 60%), hsl(240, 2%, 13%)",
    textGradient: "linear-gradient(to right, #22d3ee, #0ea5e9)",
    glow: "rgba(34, 211, 238, 0.4)",
  },
  {
    id: "violet",
    name: "Violet",
    primary: "#8B5CF6",
    secondary: "#7C3AED",
    contrastText: "#ffffff",
    rgb: "139, 92, 246",
    gradient1:
      "linear-gradient(to bottom right, #8b5cf6 0%, rgba(124, 58, 237, 0) 50%)",
    gradient2:
      "linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(124, 58, 237, 0) 60%), hsl(240, 2%, 13%)",
    textGradient: "linear-gradient(to right, #a78bfa, #8b5cf6)",
    glow: "rgba(139, 92, 246, 0.4)",
  },
  {
    id: "blue",
    name: "Blue",
    primary: "#3B82F6",
    secondary: "#2563EB",
    contrastText: "#ffffff",
    rgb: "59, 130, 246",
    gradient1:
      "linear-gradient(to bottom right, #3b82f6 0%, rgba(37, 99, 235, 0) 50%)",
    gradient2:
      "linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(37, 99, 235, 0) 60%), hsl(240, 2%, 13%)",
    textGradient: "linear-gradient(to right, #60a5fa, #3b82f6)",
    glow: "rgba(59, 130, 246, 0.4)",
  },
  {
    id: "teal",
    name: "Teal",
    primary: "#5EEAD4",
    secondary: "#14B8A6",
    contrastText: "#0f172a",
    rgb: "94, 234, 212",
    gradient1:
      "linear-gradient(to bottom right, #5eead4 0%, rgba(20, 184, 166, 0) 50%)",
    gradient2:
      "linear-gradient(135deg, rgba(94, 234, 212, 0.25) 0%, rgba(20, 184, 166, 0) 60%), hsl(240, 2%, 13%)",
    textGradient: "linear-gradient(to right, #5eead4, #14b8a6)",
    glow: "rgba(94, 234, 212, 0.4)",
  },
  {
    id: "pink",
    name: "Pink",
    primary: "#EC4899",
    secondary: "#DB2777",
    contrastText: "#ffffff",
    rgb: "236, 72, 153",
    gradient1:
      "linear-gradient(to bottom right, #ec4899 0%, rgba(219, 39, 119, 0) 50%)",
    gradient2:
      "linear-gradient(135deg, rgba(236, 72, 153, 0.25) 0%, rgba(219, 39, 119, 0) 60%), hsl(240, 2%, 13%)",
    textGradient: "linear-gradient(to right, #f472b6, #ec4899)",
    glow: "rgba(236, 72, 153, 0.4)",
  },
  {
    id: "lime",
    name: "Lime",
    primary: "#A3E635",
    secondary: "#84CC16",
    contrastText: "#111827",
    rgb: "163, 230, 53",
    gradient1:
      "linear-gradient(to bottom right, #a3e635 0%, rgba(132, 204, 22, 0) 50%)",
    gradient2:
      "linear-gradient(135deg, rgba(163, 230, 53, 0.25) 0%, rgba(132, 204, 22, 0) 60%), hsl(240, 2%, 13%)",
    textGradient: "linear-gradient(to right, #bef264, #a3e635)",
    glow: "rgba(163, 230, 53, 0.4)",
  },
];

interface ThemeContextType {
  themeMode: ThemeMode;
  accentId: string;
  accent: AccentThemeOption;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
  setAccentId: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function applyAccentToDOM(accent: AccentThemeOption) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--accent-color", accent.primary);
  root.style.setProperty("--accent-secondary", accent.secondary);
  root.style.setProperty("--accent-contrast-text", accent.contrastText);
  root.style.setProperty("--accent-rgb", accent.rgb);
  root.style.setProperty("--accent-gradient-1", accent.gradient1);
  root.style.setProperty("--accent-gradient-2", accent.gradient2);
  root.style.setProperty("--accent-text-gradient", accent.textGradient);
  root.style.setProperty("--accent-glow", accent.glow);

  // Backward compatibility mappings
  root.style.setProperty("--orange-yellow-crayola", accent.primary);
  root.style.setProperty("--vegas-gold", accent.secondary);
  root.style.setProperty("--text-gradient-yellow", accent.textGradient);
  root.style.setProperty("--bg-gradient-yellow-1", accent.gradient1);
  root.style.setProperty("--bg-gradient-yellow-2", accent.gradient2);
}

function applyThemeModeToDOM(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", mode);
  root.style.colorScheme = mode;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedMode = localStorage.getItem("portfolio-theme-mode") as ThemeMode | null;
        if (savedMode === "light" || savedMode === "dark") {
          return savedMode;
        }
      } catch {}
    }
    return "dark";
  });

  const [accentId, setAccentIdState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedAccent = localStorage.getItem("portfolio-accent-id");
        if (savedAccent) {
          const matched = ACCENT_COLORS.find(
            (c) => c.id === savedAccent || c.primary.toLowerCase() === savedAccent.toLowerCase()
          );
          if (matched) return matched.id;
        }
      } catch {}
    }
    return "cyan";
  });

  // Synchronize DOM whenever themeMode or accentId changes
  useEffect(() => {
    applyThemeModeToDOM(themeMode);
    const matched = ACCENT_COLORS.find((c) => c.id === accentId) || ACCENT_COLORS[1];
    applyAccentToDOM(matched);
  }, [themeMode, accentId]);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      localStorage.setItem("portfolio-theme-mode", mode);
    } catch {}
  }, []);

  const toggleThemeMode = useCallback(() => {
    setThemeModeState((prev) => {
      const nextMode: ThemeMode = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("portfolio-theme-mode", nextMode);
      } catch {}
      return nextMode;
    });
  }, []);

  const setAccentId = useCallback((id: string) => {
    const matched = ACCENT_COLORS.find((c) => c.id === id);
    if (matched) {
      setAccentIdState(id);
      try {
        localStorage.setItem("portfolio-accent-id", id);
      } catch {}
    }
  }, []);

  const currentAccent =
    ACCENT_COLORS.find((c) => c.id === accentId) || ACCENT_COLORS[0];

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        accentId,
        accent: currentAccent,
        setThemeMode,
        toggleThemeMode,
        setAccentId,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
