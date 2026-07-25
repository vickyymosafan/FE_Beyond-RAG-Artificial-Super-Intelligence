/**
 * Chat Service - API layer for chat operations
 * Modified to use LocalStorage for history and direct backend for chat.
 */

import type { ChatHistory, Message } from "@/types"

export interface CreateChatResponse {
  chat: ChatHistory | null
  error?: string
}

export interface SendMessageResponse {
  response: string
  citations?: any[]
  asiScore?: number
  reasoningPath?: string[]
  error?: string
}

// LocalStorage helpers
const getStorageChats = (): Record<string, ChatHistory> => {
  if (typeof window === "undefined") return {}
  const data = localStorage.getItem("smartchat_histories")
  return data ? JSON.parse(data) : {}
}

const getStorageMessages = (): Record<string, Message[]> => {
  if (typeof window === "undefined") return {}
  const data = localStorage.getItem("smartchat_messages")
  return data ? JSON.parse(data) : {}
}

const saveStorageChats = (chats: Record<string, ChatHistory>) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("smartchat_histories", JSON.stringify(chats))
  }
}

const saveStorageMessages = (messages: Record<string, Message[]>) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("smartchat_messages", JSON.stringify(messages))
  }
}

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
    title: title || "Percakapan Baru",
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
    const messages = getStorageMessages()
    const chatMessages = messages[chatId] || []
    
    // Optimistically save user message (optional, but good for local history)
    chatMessages.push({
      id: `msg_${Date.now()}_user`,
      sessionId: chatId, // following original logic
      role: "user",
      content: message,
      createdAt: new Date().toISOString(),
    })
    messages[chatId] = chatMessages
    saveStorageMessages(messages)
    
    // Update chat title if it's the first message
    const chats = getStorageChats()
    if (chats[chatId] && chatMessages.length <= 1) {
      chats[chatId].title = message.slice(0, 50) + (message.length > 50 ? "..." : "")
      chats[chatId].updatedAt = new Date().toISOString()
      saveStorageChats(chats)
    }

    // Call actual backend (using the Next.js rewrite or direct URL)
    const response = await fetch("/api/rag/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: message, userId: sessionId }), // Matching Hono API
    })

    if (!response.ok) {
      return {
        response: "Maaf, terjadi kesalahan saat memproses pesan Anda.",
        error: "Failed to send message",
      }
    }

    const data = await response.json()
    
    // Save AI response to local history
    chatMessages.push({
      id: `msg_${Date.now()}_assistant`,
      sessionId: chatId,
      role: "assistant",
      content: data.answer || "Maaf, saya tidak dapat memproses permintaan Anda.",
      createdAt: new Date().toISOString(),
    })
    messages[chatId] = chatMessages
    saveStorageMessages(messages)
    
    if (chats[chatId]) {
      chats[chatId].updatedAt = new Date().toISOString()
      saveStorageChats(chats)
    }

    return {
      response: data.answer || "Maaf, saya tidak dapat memproses permintaan Anda.",
      citations: data.citations,
      asiScore: data.asiScore,
      reasoningPath: data.reasoningPath
    }
  } catch (error) {
    console.error("Failed to send message:", error)
    return {
      response: "Maaf, terjadi kesalahan saat memproses pesan Anda.",
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
