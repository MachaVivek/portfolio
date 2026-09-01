export const API_ROUTES = {
  CHAT_STREAM: "/api/chat/stream",
  CONTACT: "/api/contact",
  HEALTH: "/api/health",
} as const;

export const BACKEND_CONFIG = {
  DEFAULT_TIMEOUT_MS: 60_000,
  CONTACT_TIMEOUT_MS: 20_000,
  FALLBACK_DOCKER_PORT: 8002,
  FALLBACK_LOCAL_PORT: 8000,
  FALLBACK_DOCKER_URL: "http://localhost:8002",
  FALLBACK_LOCAL_URL: "http://localhost:8000",
} as const;

export const STORAGE_KEYS = {
  THEME_MODE: "portfolio-theme-mode",
  ACCENT_ID: "portfolio-accent-id",
} as const;

export const APP_DEFAULTS = {
  THEME_MODE: "dark",
  ACCENT_ID: "cyan",
  CONTACT_EMAIL: "machavivek19@gmail.com",
} as const;

export const ASSET_PATHS = {
  AI_AVATAR: "/images/ai-avatar.png",
  LOGO_ICO: "/images/logo.ico",
} as const;

export const EXTERNAL_SCRIPTS = {
  IONICONS_ESM: "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js",
  IONICONS_NOMODULE: "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js",
} as const;
