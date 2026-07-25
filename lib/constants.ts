/**
 * Centralized Application Constants
 */

export const STORAGE_KEYS = {
  HISTORIES: "smartchat_histories",
  MESSAGES: "smartchat_messages",
  ADMIN_TOKEN: "admin_token",
  PREFERENCES: "smartchat_preferences",
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
} as const

export const DEFAULT_MESSAGES = {
  ERROR_GENERIC: "Maaf, terjadi kesalahan saat memproses pesan Anda.",
  ERROR_UNAUTHORIZED: "Sesi telah berakhir atau Anda tidak memiliki akses.",
  WELCOME_TITLE: "Bagaimana saya bisa membantu Anda hari ini?",
} as const
