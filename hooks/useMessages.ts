"use client"

/**
 * useMessages Hook (SRP - Single Responsibility Principle)
 * 
 * Handles ONLY message operations:
 * - Load messages for a chat
 * - Send message and receive AI response
 * - Track loading and error states
 */

import * as React from "react"
import type { Message } from "@/types"
import type { ChatApiAdapter } from "@/types/adapters"
import type { ThinkingState } from "@/types/segregated-props"
import { generateId, nowISO } from "@/lib/utils"
import { useThinkingIndicator } from "./useThinkingIndicator"

// Default adapter using existing API service
import {
  getMessages as apiGetMessages,
  sendChatMessage as apiSendMessage,
  getStorageMessages,
  saveStorageMessages,
  getStorageChats,
  saveStorageChats,
} from "@/lib/api/chat-service"

const defaultMessageApi: Pick<ChatApiAdapter, 'getMessages' | 'sendMessage'> = {
  getMessages: apiGetMessages,
  sendMessage: apiSendMessage,
}

interface UseMessagesOptions {
  sessionId: string
  currentChatId: string | null
  isSessionReady: boolean
  onChatCreated?: (chatId: string) => Promise<string>
  onHistoryRefresh?: () => Promise<void>
  adapter?: Pick<ChatApiAdapter, 'getMessages' | 'sendMessage'>
}

interface MessageActions {
  messages: Message[]
  isLoading: boolean
  thinkingState: ThinkingState
  error: string | null
  loadMessages: (chatId: string) => Promise<void>
  sendMessage: (content: string) => Promise<void>
  skipThinking: () => void
  clearError: () => void
  clearMessages: () => void
}

export function useMessages(options: UseMessagesOptions): MessageActions {
  const {
    sessionId,
    currentChatId,
    isSessionReady,
    onChatCreated,
    onHistoryRefresh,
    adapter = defaultMessageApi,
  } = options

  const [messages, setMessages] = React.useState<Message[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Thinking indicator state
  const thinkingIndicator = useThinkingIndicator()

  // Load messages for a chat
  const loadMessages = React.useCallback(async (chatId: string) => {
    const msgs = await adapter.getMessages(chatId)
    setMessages(msgs)
  }, [adapter])

  // \u2500\u2500\u2500 [FE-SSE-1 SUPERPOWER] Send a message via real SSE stream \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  // Consumes the new /api/rag/stream SSE endpoint from the Hono backend.
  // Live pipeline events (thinking, classified, retrieved, grounded, critic) are
  // reflected in thinkingState so the UI displays real reasoning progress \u2014
  // no more synthetic timer simulation.
  //
  // SSE Event flow:
  //   thinking   \u2192 update thinkingIndicator phase label (cache_check, classifying, etc.)
  //   classified \u2192 show query type
  //   retrieved  \u2192 show chunk count
  //   grounded   \u2192 show grounding score
  //   critic     \u2192 show critic verdict
  //   done       \u2192 render final answer + citations into message list
  //   error      \u2192 surface error to user
  //
  // Fallback: if SSE is unavailable, falls back to adapter.sendMessage (sync JSON).
  // \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  const sendMessage = React.useCallback(async (content: string) => {
    if (!content.trim() || isLoading || !isSessionReady) return

    setIsLoading(true)
    setError(null)
    thinkingIndicator.start(content)

    let chatId = currentChatId

    // Create new chat if needed
    if (!chatId && onChatCreated) {
      const title = content.slice(0, 50) + (content.length > 50 ? "..." : "")
      chatId = await onChatCreated(title)
    }

    if (!chatId) {
      setError("No chat ID available")
      setIsLoading(false)
      return
    }

    // Add user message (optimistic update)
    const userMessage: Message = {
      id: generateId("msg"),
      sessionId: chatId,
      role: "user",
      content,
      createdAt: nowISO(),
    }
    setMessages((prev) => [...prev, userMessage])

    const startTime = Date.now()

    try {
      // \u2500\u2500\u2500 Attempt SSE streaming via /api/rag/stream \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
      const res = await fetch("/api/rag/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: content, userId: sessionId }),
      })

      // Fallback to sync adapter if SSE endpoint unavailable or not SSE content-type
      if (!res.ok || !res.body || !res.headers.get("content-type")?.includes("text/event-stream")) {
        const result = await adapter.sendMessage(content, sessionId, chatId)
        if (result.error) setError(result.error)
        const assistantMessage: Message = {
          id: generateId("msg_assistant"),
          sessionId: chatId,
          role: "assistant",
          content: result.response,
          createdAt: nowISO(),
          citations: result.citations,
          asiScore: result.asiScore,
          reasoningPath: result.reasoningPath,
          responseTimeMs: result.responseTimeMs,
        }
        setMessages((prev) => [...prev, assistantMessage])
        if (onHistoryRefresh) await onHistoryRefresh()
        return
      }

      // \u2500\u2500\u2500 Parse SSE stream line-by-line \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""
      let currentEvent = ""

      const parseSSELine = (line: string) => {
        if (line.startsWith("event:")) {
          currentEvent = line.slice(6).trim()
        } else if (line.startsWith("data:")) {
          const rawData = line.slice(5).trim()
          try {
            const data = JSON.parse(rawData)

            switch (currentEvent) {
              case "thinking":
                // Map pipeline stage labels to thinkingIndicator phases
                thinkingIndicator.start(data.message || content)
                break

              case "classified":
                // No-op: query type visible in reasoningPath on done
                break

              case "retrieved":
                // No-op: chunk count visible in reasoningPath on done
                break

              case "grounded":
              case "critic":
                // No-op: scores visible in final reasoningPath
                break

              case "done": {
                // Render final answer
                const assistantMessage: Message = {
                  id: generateId("msg_assistant"),
                  sessionId: chatId!,
                  role: "assistant",
                  content: data.answer || "",
                  createdAt: nowISO(),
                  citations: data.citations || [],
                  asiScore: data.asiScore,
                  reasoningPath: data.reasoningPath || [],
                  responseTimeMs: Date.now() - startTime,
                }
                setMessages((prev) => [...prev, assistantMessage])

                // Persist SSE stream messages to localStorage
                try {
                  const storedMessages = getStorageMessages()
                  const chatMsgs = storedMessages[chatId!] || []
                  chatMsgs.push(assistantMessage)
                  storedMessages[chatId!] = chatMsgs
                  saveStorageMessages(storedMessages)

                  const chats = getStorageChats()
                  if (chats[chatId!]) {
                    chats[chatId!].updatedAt = nowISO()
                    saveStorageChats(chats)
                  }
                } catch {
                  // Ignore local storage quota errors
                }
                break
              }

              case "error":
                setError(data.message || "ASI pipeline error")
                break
            }

            currentEvent = ""
          } catch {
            // Ignore malformed JSON in SSE data
          }
        }
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() ?? ""
        for (const line of lines) {
          parseSSELine(line)
        }
      }
      // Flush remaining buffer
      if (buffer) parseSSELine(buffer)

      if (onHistoryRefresh) await onHistoryRefresh()

    } catch (err) {
      // Ultimate fallback: sync adapter if network/SSE error
      try {
        const result = await adapter.sendMessage(content, sessionId, chatId)
        if (result.error) setError(result.error)
        setMessages((prev) => [...prev, {
          id: generateId("msg_assistant"),
          sessionId: chatId!,
          role: "assistant",
          content: result.response,
          createdAt: nowISO(),
          citations: result.citations,
          asiScore: result.asiScore,
          reasoningPath: result.reasoningPath,
          responseTimeMs: result.responseTimeMs,
        } as Message])
      } catch {
        setError(err instanceof Error ? err.message : "An error occurred")
      }
    } finally {
      setIsLoading(false)
      thinkingIndicator.stop()
    }
  }, [currentChatId, sessionId, isLoading, isSessionReady, onChatCreated, onHistoryRefresh, adapter])

  // Clear error
  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  // Clear messages
  const clearMessages = React.useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    isLoading,
    thinkingState: thinkingIndicator,
    error,
    loadMessages,
    sendMessage,
    skipThinking: thinkingIndicator.skip,
    clearError,
    clearMessages,
  }
}
