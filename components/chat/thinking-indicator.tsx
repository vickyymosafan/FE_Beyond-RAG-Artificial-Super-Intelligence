"use client"

/**
 * ThinkingIndicator Component
 * 
 * Displays dynamic thinking status with rotating messages
 * similar to ChatGPT/Claude thinking indicators.
 */

import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2, ChevronDown, ChevronUp, Sparkles } from "lucide-react"
import type { ThinkingPhase, ThinkingState } from "@/types/segregated-props"

// ============================================
// Phase Icons & Colors
// ============================================

const PHASE_CONFIG: Record<ThinkingPhase, { icon: React.ReactNode; color: string }> = {
  analyzing: {
    icon: <Sparkles className="h-3.5 w-3.5" />,
    color: "text-blue-400",
  },
  searching: {
    icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
    color: "text-purple-400",
  },
  comparing: {
    icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
    color: "text-amber-400",
  },
  generating: {
    icon: <Sparkles className="h-3.5 w-3.5" />,
    color: "text-green-400",
  },
}

// ============================================
// Props Interface
// ============================================

interface ThinkingIndicatorProps {
  thinkingState: ThinkingState
  onSkip?: () => void
  className?: string
  isCollapsible?: boolean
}

// ============================================
// Component Implementation
// ============================================

export const ThinkingIndicator = React.memo(function ThinkingIndicator({
  thinkingState,
  onSkip,
  className,
  isCollapsible = true,
}: ThinkingIndicatorProps) {
  const [isExpanded, setIsExpanded] = React.useState(true)
  const { isThinking, currentPhase, currentMessage, progress } = thinkingState

  if (!isThinking) return null

  const phaseConfig = PHASE_CONFIG[currentPhase]

  return (
    <div className={cn("w-full pb-4 mb-3 animate-in fade-in duration-300", className)}>
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        <div className="bg-slate-950/80 backdrop-blur-md rounded-2xl border border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.15)] overflow-hidden">
          {/* Header - Clickable to collapse/expand */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => isCollapsible && setIsExpanded(!isExpanded)}
            onKeyDown={(e) => {
              if (isCollapsible && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault()
                setIsExpanded(!isExpanded)
              }
            }}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 select-none bg-linear-to-r from-cyan-950/40 via-slate-900/60 to-purple-950/40",
              "hover:from-cyan-900/50 hover:to-purple-900/50 transition-all duration-300",
              isCollapsible && "cursor-pointer"
            )}
          >
            <div className="flex items-center gap-3">
              {/* Glowing Pulse Dot */}
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
              </div>
              
              {/* Title & Phase */}
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold tracking-wider uppercase bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  ⚡ ASI Reasoning Engine
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 font-medium">
                  {currentPhase === 'analyzing' && '🧠 Menganalisis'}
                  {currentPhase === 'searching' && '🗄️ Hybrid Search'}
                  {currentPhase === 'comparing' && '🛡️ Fact Check'}
                  {currentPhase === 'generating' && '⚡ Menyusun'}
                </span>
              </div>
            </div>

            {/* Right Side Badges & Toggle */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Neon DB 768d</span>
              </div>
              <div className="hidden md:flex items-center gap-1.5 text-[11px] text-purple-300 bg-purple-950/40 px-2.5 py-1 rounded-lg border border-purple-800/40">
                <span>🐝 Swarm 4x</span>
              </div>

              {isCollapsible && (
                <div className="text-cyan-400 hover:text-cyan-200 transition-colors p-1">
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Expanded Content - Deep Reasoning Log */}
          {isExpanded && (
            <div className="px-4 py-3 bg-slate-950/60 border-t border-cyan-900/20 space-y-3">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 text-cyan-400">
                  {phaseConfig.icon}
                </div>
                <p className="text-xs font-mono text-cyan-200/90 leading-relaxed tracking-wide">
                  {currentMessage}
                </p>
              </div>
              
              {/* Micro-Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>PROSES REASONING</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className="h-full bg-linear-to-r from-cyan-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})
