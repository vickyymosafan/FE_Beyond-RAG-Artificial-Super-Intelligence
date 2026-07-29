import type { AdminDocument } from "@/types"
import { STORAGE_KEYS, API_ROUTES, ADMIN_ROUTES } from "@/lib/constants"
import { logError } from "@/lib/error-handler"

export type { AdminDocument }

export interface LearningLogEntry {
  id: number
  query: string
  originalAnswer: string
  improvedAnswer?: string
  gapScore: number
  gapsFound: string[]
  missingKeywords: string[]
  wasImproved: boolean
  improvementReason?: string
  providerUsed: string
  originalScore: number
  improvedScore?: number
  createdAt: string
}

export interface LearningStats {
  totalLogs: number
  totalImproved: number
  avgGapScore: number
  improvementRate: number
}


function getToken(): string | null {
  if (typeof window === "undefined") return null
  try {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN)
  } catch (error) {
    logError("getToken", error)
    return null
  }
}

async function api<T = unknown>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken()
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN)
      } catch (error) {
        logError("removeToken", error)
      }
    }
    throw new Error("Unauthorized")
  }
  if (!res.ok) {
    const errorText = await res.text().catch(() => "HTTP Error")
    throw new Error(errorText || `Request failed with status ${res.status}`)
  }
  return res.json() as Promise<T>
}

export const adminService = {
  async login(username: string, password: string): Promise<{ token: string; expiresAt: number }> {
    const res = await fetch(API_ROUTES.ADMIN_LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
    if (!res.ok) throw new Error("Kredensial tidak valid")
    return res.json() as Promise<{ token: string; expiresAt: number }>
  },

  async getDocuments(): Promise<AdminDocument[]> {
    const data = await api<{ documents: AdminDocument[] }>(API_ROUTES.ADMIN_DOCUMENTS)
    return data.documents || []
  },

  async getDocument(id: string): Promise<{ document: AdminDocument }> {
    return api<{ document: AdminDocument }>(`${API_ROUTES.ADMIN_DOCUMENTS}/${id}`)
  },

  async deleteDocument(id: string): Promise<{ success: boolean }> {
    return api<{ success: boolean }>(`${API_ROUTES.ADMIN_DOCUMENTS}/${id}`, { method: "DELETE" })
  },

  async uploadDocument(file: File, docId: string, title: string): Promise<{ success: boolean; docId: string }> {
    const token = getToken()
    const formData = new FormData()
    formData.append("file", file)
    formData.append("docId", docId)
    formData.append("title", title)

    const res = await fetch(API_ROUTES.ADMIN_UPLOAD, {
      method: "POST",
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: formData,
    })

    if (!res.ok) {
      const errorText = await res.text().catch(() => "Upload failed")
      throw new Error(errorText || "Gagal mengunggah dokumen")
    }
    return res.json()
  },

  async clearCache(): Promise<{ success: boolean; deleted: number }> {
    return api<{ success: boolean; deleted: number }>(API_ROUTES.ADMIN_CACHE_CLEAR, { method: "POST" })
  },

  async getLearningLogs(limit = 50): Promise<LearningLogEntry[]> {
    const data = await api<{ logs: LearningLogEntry[] }>(`${API_ROUTES.ADMIN_LEARNING_LOGS}?limit=${limit}`)
    return data.logs || []
  },

  async getLearningStats(): Promise<LearningStats> {
    const data = await api<{ stats: LearningStats }>(API_ROUTES.ADMIN_STATS_LEARNING)
    return data.stats
  },
}
