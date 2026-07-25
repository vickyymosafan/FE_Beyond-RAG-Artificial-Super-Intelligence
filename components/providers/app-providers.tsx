"use client"

import type React from "react"

import { ThemeProvider } from "./theme-provider"
import { ChatProvider } from "./chat-provider"

interface AppProvidersProps {
  children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="smartchat-theme">
      <ChatProvider>{children}</ChatProvider>
    </ThemeProvider>
  )
}
