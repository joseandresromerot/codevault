"use client"

import { useQuery } from "urql"
import { GET_SNIPPET } from "@/lib/graphql/snippets"
import { Copy, Check, Globe, Lock, ArrowLeft, Pencil } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const LANGUAGE_COLORS: Record<string, string> = {
  javascript: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  typescript: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  python: "text-green-400 bg-green-400/10 border-green-400/20",
  rust: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  go: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  css: "text-pink-400 bg-pink-400/10 border-pink-400/20",
  html: "text-red-400 bg-red-400/10 border-red-400/20",
  sql: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  bash: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
  json: "text-lime-400 bg-lime-400/10 border-lime-400/20",
}

type SnippetDetailProps = {
  slug: string
}

export const SnippetDetail = ({ slug }: SnippetDetailProps) => {
  const [copied, setCopied] = useState(false)
  const [{ data, fetching }] = useQuery({ query: GET_SNIPPET, variables: { slug } })

  const handleCopy = async () => {
    await navigator.clipboard.writeText(data?.snippet?.code ?? "")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const snippet = data?.snippet
  if (!snippet) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-3">
        <p className="text-white font-semibold text-lg">Snippet not found</p>
        <Link href="/dashboard" className="text-indigo-400 text-sm hover:underline">
          Back to dashboard
        </Link>
      </div>
    )
  }

  const langColor = LANGUAGE_COLORS[snippet.language.toLowerCase()] ?? "text-zinc-400 bg-zinc-400/10 border-zinc-400/20"

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Top bar */}
      <div className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/edit/${snippet.id}`}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-600 rounded-lg transition-colors"
          >
            <Pencil size={14} />
            Edit
          </Link>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg transition-colors"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy code"}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full border", langColor)}>
              {snippet.language}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-zinc-500">
              {snippet.visibility === "PUBLIC" ? <Globe size={12} /> : <Lock size={12} />}
              {snippet.visibility.toLowerCase()}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">{snippet.title}</h1>
          {snippet.description && (
            <p className="text-zinc-400">{snippet.description}</p>
          )}

          {snippet.tags.length > 0 && (
            <div className="flex items-center gap-2 mt-3">
              {snippet.tags.map(({ tag }: { tag: { id: string; name: string } }) => (
                <span key={tag.id} className="text-xs text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full">
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 mt-4">
            {snippet.user.image && (
              <img src={snippet.user.image} alt="" className="w-5 h-5 rounded-full" />
            )}
            <span className="text-xs text-zinc-500">
              {snippet.user.name} · {new Date(snippet.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Code block */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800">
            <span className="text-xs text-zinc-500 font-mono">{snippet.language}</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="p-6 overflow-x-auto">
            <code className="text-sm text-zinc-200 font-mono leading-relaxed whitespace-pre">
              {snippet.code}
            </code>
          </pre>
        </div>
      </div>
    </div>
  )
}
