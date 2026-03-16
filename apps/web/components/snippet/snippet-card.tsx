"use client"

import Link from "next/link"
import { Globe, Lock, Copy, Check } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const LANGUAGE_COLORS: Record<string, string> = {
  javascript: "text-yellow-400 bg-yellow-400/10",
  typescript: "text-blue-400 bg-blue-400/10",
  python: "text-green-400 bg-green-400/10",
  rust: "text-orange-400 bg-orange-400/10",
  go: "text-cyan-400 bg-cyan-400/10",
  css: "text-pink-400 bg-pink-400/10",
  html: "text-red-400 bg-red-400/10",
  sql: "text-purple-400 bg-purple-400/10",
  bash: "text-zinc-400 bg-zinc-400/10",
  json: "text-lime-400 bg-lime-400/10",
}

type SnippetCardProps = {
  id: string
  title: string
  description?: string | null
  code: string
  language: string
  visibility: "PUBLIC" | "PRIVATE"
  slug: string
  tags: { tag: { id: string; name: string } }[]
}

export const SnippetCard = ({ title, description, code, language, visibility, slug, tags }: SnippetCardProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const langColor = LANGUAGE_COLORS[language.toLowerCase()] ?? "text-zinc-400 bg-zinc-400/10"
  const preview = code.split("\n").slice(0, 6).join("\n")

  return (
    <Link href={`/s/${slug}`} className="group block">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all duration-200 hover:shadow-xl hover:shadow-black/20">
        {/* Header */}
        <div className="px-4 py-3 flex items-start justify-between gap-3 border-b border-zinc-800">
          <div className="min-w-0">
            <h3 className="font-semibold text-white text-sm truncate group-hover:text-indigo-400 transition-colors">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-zinc-500 mt-0.5 truncate">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {visibility === "PUBLIC" ? (
              <Globe size={13} className="text-zinc-500" />
            ) : (
              <Lock size={13} className="text-zinc-500" />
            )}
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-zinc-700"
            >
              {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} className="text-zinc-400" />}
            </button>
          </div>
        </div>

        {/* Code preview */}
        <div className="bg-zinc-950 px-4 py-3 h-32 overflow-hidden relative">
          <pre className="text-xs text-zinc-400 font-mono leading-relaxed">
            <code>{preview}</code>
          </pre>
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-zinc-950 to-transparent" />
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 flex items-center justify-between">
          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", langColor)}>
            {language}
          </span>
          {tags.length > 0 && (
            <div className="flex items-center gap-1.5">
              {tags.slice(0, 3).map(({ tag }) => (
                <span key={tag.id} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
