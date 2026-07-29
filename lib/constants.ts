/**
 * Centralized Application Constants
 */

export const STORAGE_KEYS = {
  HISTORIES: "smartchat_histories",
  MESSAGES: "smartchat_messages",
  ADMIN_TOKEN: "admin_token",
  PREFERENCES: "smartchat_preferences",
  SESSION_ID: "smartchat-session-id",
} as const

export const API_ROUTES = {
  RAG_QUERY: "/api/rag/query",
  RAG_FEEDBACK: "/api/rag/feedback",
  ADMIN_LOGIN: "/api/admin/login",
  ADMIN_DOCUMENTS: "/api/admin/documents",
  ADMIN_UPLOAD: "/api/admin/documents/upload",
  ADMIN_STATS_RPD: "/api/admin/stats/rpd",
  ADMIN_CACHE_TOP: "/api/admin/cache/top",
  ADMIN_FAQ: "/api/admin/faq",
  ADMIN_CACHE_CLEAR: "/api/admin/cache/clear",
  ADMIN_LEARNING_LOGS: "/api/admin/learning-logs",
  ADMIN_STATS_LEARNING: "/api/admin/stats/learning",
} as const

export const UI_STRINGS = {
  NEW_CHAT_TITLE: "Percakapan Baru",
  CACHE_HIT_LABEL: "Cache Hit • Respon Instan",
  CACHE_HIT_CHECK: "cache hit",
  DEFAULT_FAST_TIME: "<50ms",
  UMJ_LOGO_PATH: "/UMJ.webp",
  AI_AVATAR_TEXT: "AI",
} as const

export const ADMIN_ROUTES = {
  LOGIN: "/vickymosafan",
  DASHBOARD: "/vickymosafan/dashboard",
} as const

export const LIMITS = {
  TITLE_MAX_LENGTH: 50,
  HISTORY_DEPTH: 5,
  TIME_UNIT_MS: 1000,
} as const

export const DEFAULT_MESSAGES = {
  ERROR_GENERIC: "Maaf, terjadi kesalahan saat memproses pesan Anda.",
  ERROR_UNAUTHORIZED: "Sesi telah berakhir atau Anda tidak memiliki akses.",
  WELCOME_TITLE: "Bagaimana saya bisa membantu Anda hari ini?",
} as const
