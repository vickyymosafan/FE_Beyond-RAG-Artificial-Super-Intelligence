"use client"
import * as React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"

interface MarkdownRendererProps {
  content: string
  className?: string
}

// ============================================
// STATIC REMARK PLUGINS (prevents re-creation)
// ============================================
const remarkPlugins = [remarkGfm]

// ============================================
// SMART MS WORD OUTLINING PREPROCESSOR
// Auto-detects unindented sub-items ('a. ', 'b. ', '1) ', 'a) ')
// and converts them to structured markdown lists with Word-style hierarchy
// ============================================
function preprocessMarkdownForWordOutlining(raw: string): string {
  if (!raw) return ""
  const lines = raw.split("\n")
  const processed: string[] = []

  let inNumberedList = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    const isNumberItem = /^\d+[.)]\s+/.test(trimmed)
    const isLetterItem = /^[a-z][.)]\s+/i.test(trimmed)
    const isBulletItem = /^[-*•]\s+/.test(trimmed)

    if (isNumberItem) {
      inNumberedList = true
      processed.push(line)
    } else if (isLetterItem) {
      // Auto-indent letter sub-items (a., b., c.) under previous numbered item like MS Word
      if (!line.startsWith("    ") && !line.startsWith("\t")) {
        processed.push("    " + line)
      } else {
        processed.push(line)
      }
    } else if (isBulletItem && inNumberedList) {
      // Auto-indent bullet sub-items under numbered list
      if (!line.startsWith("    ") && !line.startsWith("\t")) {
        processed.push("    " + line)
      } else {
        processed.push(line)
      }
    } else {
      if (trimmed === "") inNumberedList = false
      processed.push(line)
    }
  }

  return processed.join("\n")
}

// ============================================
// MICROSOFT WORD OUTLINING & DOCUMENT FORMATTING
// Preserves original font while providing MS Word document layout & list indents
// ============================================
const markdownComponents = {
  // Headings - Clean document headers
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="text-xl sm:text-2xl font-semibold tracking-tight mt-5 mb-3 text-foreground pb-1.5 border-b border-border/60 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-lg sm:text-xl font-semibold tracking-tight mt-4 mb-2.5 text-foreground pb-1 border-b border-border/40">
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-base sm:text-lg font-semibold tracking-tight mt-3.5 mb-2 text-foreground">
      {children}
    </h3>
  ),
  h4: ({ children }: { children?: React.ReactNode }) => (
    <h4 className="text-sm sm:text-base font-semibold mt-3 mb-1.5 text-foreground">
      {children}
    </h4>
  ),
  h5: ({ children }: { children?: React.ReactNode }) => (
    <h5 className="text-xs sm:text-sm font-semibold mt-2 mb-1 text-foreground">{children}</h5>
  ),
  h6: ({ children }: { children?: React.ReactNode }) => (
    <h6 className="text-xs sm:text-sm font-medium mt-2 mb-1 text-muted-foreground">
      {children}
    </h6>
  ),

  // Paragraphs - Body text
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="my-2.5 leading-relaxed text-sm sm:text-base text-foreground/90 tracking-normal first:mt-0 last:mb-0">
      {children}
    </p>
  ),

  // Lists - Microsoft Word Hanging Indents & Outlining Alignment
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="my-2.5 pl-6 sm:pl-8 list-disc space-y-1.5 text-foreground/90">
      {children}
    </ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="my-2.5 pl-6 sm:pl-8 list-decimal space-y-1.5 text-foreground/90">
      {children}
    </ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="leading-relaxed text-sm sm:text-base pl-1.5 marker:text-primary font-medium">{children}</li>
  ),

  // Callouts & Blockquotes - Document Quote Box
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="my-3.5 border-l-4 border-primary/60 bg-muted/40 px-4 py-2.5 rounded-r-lg italic text-muted-foreground text-sm">
      {children}
    </blockquote>
  ),

  // Code - Inline badges and code blocks
  code: ({ className, children, ...props }: { className?: string; children?: React.ReactNode }) => {
    const isInline = !className
    if (isInline) {
      return (
        <code
          className="relative rounded bg-muted/80 px-1.5 py-0.5 font-mono text-xs sm:text-sm border border-border/50 text-foreground font-normal"
          {...props}
        >
          {children}
        </code>
      )
    }
    const language = className?.replace("language-", "") || "text"
    return (
      <div className="my-3.5 overflow-hidden rounded-lg border border-border/80 bg-muted/40 shadow-xs">
        <div className="flex items-center justify-between bg-muted/80 px-3.5 py-1.5 text-xs text-muted-foreground font-mono font-medium border-b border-border/50">
          <span>{language}</span>
        </div>
        <pre className="overflow-x-auto p-3.5">
          <code className={cn("font-mono text-xs sm:text-sm text-foreground", className)} {...props}>
            {children}
          </code>
        </pre>
      </div>
    )
  },
  pre: ({ children }: { children?: React.ReactNode }) => <>{children}</>,

  // Table - Word Document Table Format
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="my-4 overflow-x-auto rounded-lg border border-border/80 shadow-xs">
      <table className="w-full border-collapse text-xs sm:text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => (
    <thead className="bg-muted/70 border-b border-border text-foreground font-semibold">{children}</thead>
  ),
  tbody: ({ children }: { children?: React.ReactNode }) => (
    <tbody className="divide-y divide-border/60 bg-card">{children}</tbody>
  ),
  tr: ({ children }: { children?: React.ReactNode }) => (
    <tr className="border-b border-border/60 hover:bg-muted/30 transition-colors last:border-0">{children}</tr>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="px-3.5 sm:px-4 py-2.5 text-left font-semibold text-foreground">{children}</th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className="px-3.5 sm:px-4 py-2 text-foreground/90">{children}</td>
  ),

  // Links
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary font-medium underline underline-offset-4 hover:text-primary/80 transition-colors"
    >
      {children}
    </a>
  ),

  // Images
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <span className="block my-4">
      <img
        {...props}
        src={typeof props.src === 'string' ? props.src : ''}
        alt={props.alt || ""}
        className="rounded-lg max-w-full h-auto border border-border shadow-xs"
        loading="lazy"
      />
    </span>
  ),

  // Horizontal rule
  hr: () => <hr className="my-5 border-border/60" />,

  // Strong and emphasis
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="italic">{children}</em>
  ),

  // Strikethrough
  del: ({ children }: { children?: React.ReactNode }) => (
    <del className="line-through text-muted-foreground">{children}</del>
  ),

  // Task lists
  input: ({ checked, ...props }: { checked?: boolean }) => (
    <input
      type="checkbox"
      checked={checked}
      readOnly
      className="mr-2 h-4 w-4 rounded border-border"
      {...props}
    />
  ),
}

// ============================================
// MEMOIZED MARKDOWN RENDERER
// Only re-renders when content or className changes
// ============================================
export const MarkdownRenderer = React.memo(
  function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
    const formattedContent = React.useMemo(
      () => preprocessMarkdownForWordOutlining(content),
      [content]
    )

    return (
      <div className={cn("prose prose-sm dark:prose-invert max-w-none leading-relaxed text-foreground", className)}>
        <ReactMarkdown remarkPlugins={remarkPlugins} components={markdownComponents}>
          {formattedContent}
        </ReactMarkdown>
      </div>
    )
  },
  (prevProps, nextProps) =>
    prevProps.content === nextProps.content && prevProps.className === nextProps.className
)
