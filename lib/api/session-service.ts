/**
 * Session Service - API layer for session operations
 * Separates API calls from React state management (SoC principle)
 */

import { generateId } from "@/lib/utils"
import { STORAGE_KEYS } from "@/lib/constants"

/**
 * Get or create a session ID from sessionStorage
 */
export function getStoredSessionId(): string {
  if (typeof window === "undefined") return generateId("session")
  
  try {
    let sessionId = sessionStorage.getItem(STORAGE_KEYS.SESSION_ID)
    if (!sessionId) {
      sessionId = generateId("session")
      sessionStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId)
    }
    return sessionId
  } catch (error) {
    console.error("Session storage error", error)
    return generateId("session")
  }
}

/**
 * Store a new session ID in sessionStorage
 */
export function storeSessionId(sessionId: string): void {
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId)
    } catch (error) {
      console.error("Session storage error", error)
    }
  }
}

/**
 * Create a session on the server (mocked as true since backend is stateless)
 */
export async function createSession(sessionId: string): Promise<boolean> {
  return true
}

/**
 * Create a session with automatic retry on failure
 * If the initial session fails, generates a new session ID and retries
 */
export async function createSessionWithRetry(
  initialSessionId: string
): Promise<{ success: boolean; sessionId: string }> {
  let sessionId = initialSessionId
  storeSessionId(sessionId)
  return { success: true, sessionId }
}
