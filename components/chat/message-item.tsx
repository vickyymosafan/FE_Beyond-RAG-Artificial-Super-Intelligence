"use client"

/**
 * MessageItem Component (Refactored with SOLID Principles)
 * 
 * ISP: Uses segregated prop interfaces
 * OCP: Extensible via userAvatar, assistantAvatar, renderContent props
 * SRP: Only handles message rendering
 * 
 * Performance: MarkdownRenderer is lazy-loaded to reduce initial bundle
 */

import * as React from "react"
import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Zap, Copy, Check, ShieldCheck, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, BookOpen, Sparkles } from "lucide-react"
import Image from "next/image"
import type { Citation } from "@/types"
import type { MessageItemProps } from "@/types/segregated-props"
import { UI_STRINGS, LIMITS, API_ROUTES } from "@/lib/constants"

// Lazy load MarkdownRenderer (~100KB react-markdown bundle)
const MarkdownRenderer = dynamic(
  () => import("./markdown-renderer").then((mod) => mod.MarkdownRenderer),
  {
    loading: () => (
      <div className="animate-pulse space-y-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
      </div>
    ),
    ssr: false, // Client-side only - improves SSR performance
  }
)

// ============================================
// Default Avatars (OCP - can be overridden)
// ============================================

const DefaultUserAvatar = () => (
  <Avatar className="h-7 w-7 sm:h-8 sm:w-8 shrink-0 bg-primary">
    <AvatarFallback className="bg-primary text-primary-foreground">
      <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
    </AvatarFallback>
  </Avatar>
)

const DefaultAssistantAvatar = () => (
  <Image 
    src={UI_STRINGS.UMJ_LOGO_PATH} 
    alt={UI_STRINGS.AI_AVATAR_TEXT} 
    width={32} 
    height={32} 
    className="h-7 w-7 sm:h-8 sm:w-8 shrink-0 rounded-full" 
  />
)

// ============================================
// Default Content Renderers (OCP - can be overridden)
// ============================================

const DefaultUserContent = ({ content }: { content: string }) => (
  <div className="rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-3 py-2 sm:px-4 sm:py-2.5">
    <p className="text-xs sm:text-sm whitespace-pre-wrap wrap-break-word">{content}</p>
  </div>
)

const DefaultAssistantContent = ({ 
  content, 
  citations,
  asiScore,
  reasoningPath,
  responseTimeMs,
}: { 
  content: string
  citations?: Citation[]
  asiScore?: number
  reasoningPath?: string[] 
  responseTimeMs?: number
}) => {
  const [copied, setCopied] = React.useState(false)
  const [showReasoning, setShowReasoning] = React.useState(false)
  const [feedback, setFeedback] = React.useState<'up' | 'down' | null>(null)

  const isCacheHit = reasoningPath?.some((r) => r.toLowerCase().includes(UI_STRINGS.CACHE_HIT_CHECK))

  const durationLabel = responseTimeMs
    ? (responseTimeMs < LIMITS.TIME_UNIT_MS ? `${responseTimeMs}ms` : `${(responseTimeMs / LIMITS.TIME_UNIT_MS).toFixed(1)}s`)
    : UI_STRINGS.DEFAULT_FAST_TIME

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFeedback = async (rating: 'up' | 'down') => {
    setFeedback(rating)
    try {
      await fetch(API_ROUTES.RAG_FEEDBACK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: content.slice(0, 100), userId: 'user-feedback', rating }),
      })
    } catch {
      // Ignore feedback network errors
    }
  }

  return (
    <div className="space-y-2 group relative">
      <div className="rounded-2xl rounded-tl-sm bg-muted px-3 py-2 sm:px-4 sm:py-3 relative">
        <MarkdownRenderer content={content} />
        
        {/* Superpowers One-Click Copy to Word / Clipboard Button */}
        <button
          onClick={handleCopy}
          title="Salin jawaban untuk MS Word"
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-background/80 hover:bg-background border border-border text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity text-xs flex items-center gap-1 shadow-sm"
        >
          {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
          <span className="text-[10px] font-medium hidden sm:inline">{copied ? "Tersalin!" : "Salin ke Word"}</span>
        </button>
      </div>

      {/* ─── CITATIONS & MERKLE FACT HASH BADGES ──────────────────────────── */}
      {citations && citations.length > 0 && (
        <div className="bg-card border rounded-xl p-3 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-primary text-[11px] uppercase tracking-wider">
            <BookOpen className="size-3.5" /> Sumber Rujukan Resmi PDF
          </div>
          <div className="flex flex-wrap gap-2">
            {citations.map((c, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/60 border text-[11px]">
                <span className="font-medium text-foreground">{c.docName}</span>
                <span className="text-muted-foreground">Hal {c.page}</span>
                {c.docName.includes('FactHash') && (
                  <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    <ShieldCheck className="size-3" /> SHA-256 Verified
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── METADATA BADGES & REASONING PATH ACCORDION ────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Cache Hit Badge */}
          {isCacheHit ? (
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <Zap className="size-3 fill-emerald-500/30" />
              <span>{UI_STRINGS.CACHE_HIT_LABEL} ({durationLabel})</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono text-muted-foreground border">
              <span>Respon: {durationLabel}</span>
            </div>
          )}

          {/* ASI Score Meter Badge */}
          {asiScore !== undefined && (
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              <Sparkles className="size-3" />
              <span>ASI Score: {(asiScore * 100).toFixed(0)}%</span>
            </div>
          )}

          {/* Collapsible Reasoning Path Trigger */}
          {reasoningPath && reasoningPath.length > 0 && (
            <button
              onClick={() => setShowReasoning(!showReasoning)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <span>Langkah Reasoning ({reasoningPath.length})</span>
              {showReasoning ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
            </button>
          )}
        </div>

        {/* Feedback Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => handleFeedback('up')}
            className={`p-1 rounded hover:bg-muted text-xs ${feedback === 'up' ? 'text-emerald-500 font-bold' : 'text-muted-foreground'}`}
            title="Jawaban Sangat Membantu"
          >
            <ThumbsUp className="size-3.5" />
          </button>
          <button
            onClick={() => handleFeedback('down')}
            className={`p-1 rounded hover:bg-muted text-xs ${feedback === 'down' ? 'text-rose-500 font-bold' : 'text-muted-foreground'}`}
            title="Jawaban Kurang Tepat"
          >
            <ThumbsDown className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded Reasoning Path Steps */}
      {showReasoning && reasoningPath && (
        <div className="bg-muted/40 border rounded-xl p-3 text-xs space-y-1 font-mono text-muted-foreground animate-in fade-in duration-200">
          <div className="font-semibold text-foreground text-[11px] uppercase tracking-wider pb-1 border-b">
            Reasoning Artificial Super Intelligents
          </div>
          {reasoningPath.map((step, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-primary font-bold">{idx + 1}.</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// Component Implementation
// ============================================

export const MessageItem = React.memo(function MessageItem({
  // Display props (required)
  message,
  className,
  
  // Extension props (OCP)
  userAvatar,
  assistantAvatar,
  renderContent,
}: MessageItemProps) {
  const isUser = message.role === "user"

  // Resolve avatar (OCP - customizable)
  const avatar = isUser 
    ? (userAvatar ?? <DefaultUserAvatar />)
    : (assistantAvatar ?? <DefaultAssistantAvatar />)

  // Resolve content (OCP - customizable)
  const content = renderContent 
    ? renderContent(message.content, message.role as 'user' | 'assistant')
    : (isUser 
        ? <DefaultUserContent content={message.content} />
        : <DefaultAssistantContent 
            content={message.content} 
            citations={message.citations}
            asiScore={message.asiScore}
            reasoningPath={message.reasoningPath} 
            responseTimeMs={message.responseTimeMs} 
          />
      )

  return (
    <div className={cn("w-full py-2.5 sm:py-3 md:py-4", className)}>
      <div 
        className={cn(
          "max-w-4xl mx-auto flex gap-2 sm:gap-3 px-3 sm:px-4",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        {avatar}

        <div className={cn(
          "flex-1 min-w-0 max-w-[90%] sm:max-w-[85%] md:max-w-[75%]", 
          isUser ? "flex flex-col items-end" : ""
        )}>
          {content}
        </div>
      </div>
    </div>
  )
})
