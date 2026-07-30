/**
 * Chat Service - API & Storage layer for chat operations
 */

import type { ChatHistory, Message, Citation } from "@/types"
import { STORAGE_KEYS, API_ROUTES, DEFAULT_MESSAGES, UI_STRINGS, LIMITS } from "@/lib/constants"
import { logError } from "@/lib/error-handler"
import { sanitizeInput } from "@/lib/utils"

export interface CreateChatResponse {
  chat: ChatHistory | null
  error?: string
}

export interface SendMessageResponse {
  response: string
  citations?: Citation[]
  asiScore?: number
  reasoningPath?: string[]
  responseTimeMs?: number
  error?: string
}

const MSG_PREFIX = "msg_"

function getStorageData<T>(key: string): T {
  if (typeof window === "undefined") return {} as T
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : ({} as T)
  } catch (error) {
    logError(`getStorageData:${key}`, error)
    return {} as T
  }
}

function saveStorageData<T>(key: string, data: T): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    logError(`saveStorageData:${key}`, error)
  }
}

export const getStorageChats = (): Record<string, ChatHistory> => getStorageData(STORAGE_KEYS.HISTORIES)
export const getStorageMessages = (): Record<string, Message[]> => getStorageData(STORAGE_KEYS.MESSAGES)
export const saveStorageChats = (chats: Record<string, ChatHistory>): void => saveStorageData(STORAGE_KEYS.HISTORIES, chats)
export const saveStorageMessages = (messages: Record<string, Message[]>): void => saveStorageData(STORAGE_KEYS.MESSAGES, messages)

/**
 * Create a new chat session
 */
export async function createChat(
  sessionId: string,
  chatId: string,
  title: string
): Promise<CreateChatResponse> {
  const chats = getStorageChats()
  const newChat: ChatHistory = {
    id: chatId,
    sessionId: sessionId,
    title: title || UI_STRINGS.NEW_CHAT_TITLE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  chats[chatId] = newChat
  saveStorageChats(chats)
  
  return { chat: newChat }
}

/**
 * Get all chat histories for a session
 */
export async function getChats(sessionId: string): Promise<ChatHistory[]> {
  const chats = getStorageChats()
  return Object.values(chats)
    .filter(chat => chat.sessionId === sessionId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
}

/**
 * Get messages for a specific chat
 */
export async function getMessages(chatId: string): Promise<Message[]> {
  const messages = getStorageMessages()
  return messages[chatId] || []
}

/**
 * Send a message and get AI response
 */
export async function sendChatMessage(
  message: string,
  sessionId: string,
  chatId: string
): Promise<SendMessageResponse> {
  try {
    const cleanMessage = sanitizeInput(message)
    const messages = getStorageMessages()
    const chatMessages = messages[chatId] || []
    
    // Save user message locally
    chatMessages.push({
      id: `${MSG_PREFIX}${Date.now()}_user`,
      sessionId: chatId,
      role: "user",
      content: cleanMessage,
      createdAt: new Date().toISOString(),
    })
    messages[chatId] = chatMessages
    saveStorageMessages(messages)
    
    // Update chat title if first message
    const chats = getStorageChats()
    if (chats[chatId] && chatMessages.length <= 1) {
      chats[chatId].title = message.slice(0, LIMITS.TITLE_MAX_LENGTH) + (message.length > LIMITS.TITLE_MAX_LENGTH ? "..." : "")
      chats[chatId].updatedAt = new Date().toISOString()
      saveStorageChats(chats)
    }

    const historyPayload = chatMessages.slice(-LIMITS.HISTORY_DEPTH, -1).map(m => ({
      role: m.role,
      content: m.content,
    }))

    // Measure real execution time
    const startTime = Date.now()

    // Call RAG query API
    const response = await fetch(API_ROUTES.RAG_QUERY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: cleanMessage,
        userId: sessionId,
        history: historyPayload,
      }),
    })

    const responseTimeMs = Date.now() - startTime

    if (!response.ok) {
      return {
        response: DEFAULT_MESSAGES.ERROR_GENERIC,
        error: `API error status: ${response.status}`,
        responseTimeMs,
      }
    }

    const data = await response.json()
    const answerText = data.answer || DEFAULT_MESSAGES.ERROR_GENERIC
    
    // Save AI response locally
    chatMessages.push({
      id: `${MSG_PREFIX}${Date.now()}_assistant`,
      sessionId: chatId,
      role: "assistant",
      content: answerText,
      createdAt: new Date().toISOString(),
      citations: data.citations,
      asiScore: data.asiScore,
      reasoningPath: data.reasoningPath,
      responseTimeMs,
    })
    messages[chatId] = chatMessages
    saveStorageMessages(messages)
    
    if (chats[chatId]) {
      chats[chatId].updatedAt = new Date().toISOString()
      saveStorageChats(chats)
    }

    return {
      response: answerText,
      citations: data.citations,
      asiScore: data.asiScore,
      reasoningPath: data.reasoningPath,
      responseTimeMs,
    }
  } catch (error) {
    logError("sendChatMessage", error)
    return {
      response: DEFAULT_MESSAGES.ERROR_GENERIC,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Delete a chat
 */
export async function deleteChat(chatId: string): Promise<boolean> {
  const chats = getStorageChats()
  const messages = getStorageMessages()
  
  delete chats[chatId]
  delete messages[chatId]
  
  saveStorageChats(chats)
  saveStorageMessages(messages)
  return true
}

/**
 * Rename a chat
 */
export async function renameChat(chatId: string, newTitle: string): Promise<boolean> {
  const chats = getStorageChats()
  if (chats[chatId]) {
    chats[chatId].title = newTitle
    chats[chatId].updatedAt = new Date().toISOString()
    saveStorageChats(chats)
    return true
  }
  return false
}
