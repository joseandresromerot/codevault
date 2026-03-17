"use client"

import { useState } from "react"
import { useQuery } from "urql"
import { GET_PUBLIC_SNIPPETS } from "@/lib/graphql/snippets"
import { Search, X, Globe } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const LANGUAGES = [
  "javascript", "typescript", "python", "rust", "go",
  "css", "html", "sql", "bash", "json", "other",
]

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

const ExplorePage = () => {
  const [search, setSearch] = useState("")
  const [language, setLanguage] = useState("")

  const [{ data, fetching }] = useQuery({
    query: GET_PUBLIC_SNIPPETS,
    variables: { search: search || null, language: language || null },
    requestPolicy: "cache-and-network",
  })

  const snippets = data?.publicSnippets ?? []

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Globe size={20} className="text-emerald-400" />
          <h1 className="text-2xl font-bold text-white">Explore</h1>
        </div>
        <p className="text-zinc-500 text-sm">Discover public snippets from the community</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="relative w-full md:max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search public snippets..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-9 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(language === lang ? "" : lang)}
              className={cn(
                "px-3 py-1.5 text-xs rounded-lg border transition-colors",
                language === lang
                  ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                  : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
              )}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {fetching ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl h-52 animate-pulse" />
          ))}
        </div>
      ) : snippets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 border border-zinc-800">
            <Globe size={28} className="text-zinc-600" />
          </div>
          <h3 className="text-white font-semibold text-lg mb-1">No public snippets yet</h3>
          <p className="text-zinc-500 text-sm">Be the first to share a snippet with the community</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {snippets.map((snippet: any) => {
            const langColor = LANGUAGE_COLORS[snippet.language.toLowerCase()] ?? "text-zinc-400 bg-zinc-400/10 border-zinc-400/20"
            return (
              <Link
                key={snippet.id}
                href={`/s/${snippet.slug}`}
                className="group bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all flex flex-col gap-3"
              >
                {/* Language + Author */}
                <div className="flex items-center justify-between">
                  <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full border", langColor)}>
                    {snippet.language}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {snippet.user.image && (
                      <img src={snippet.user.image} alt="" className="w-4 h-4 rounded-full" />
                    )}
                    <span className="text-xs text-zinc-500 truncate max-w-[100px]">{snippet.user.name}</span>
                  </div>
                </div>

                {/* Title + description */}
                <div>
                  <h3 className="text-white font-semibold text-sm group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {snippet.title}
                  </h3>
                  {snippet.description && (
                    <p className="text-zinc-500 text-xs mt-1 line-clamp-2">{snippet.description}</p>
                  )}
                </div>

                {/* Code preview */}
                <div className="bg-zinc-950 rounded-lg p-3 flex-1 overflow-hidden">
                  <pre className="text-xs text-zinc-400 font-mono leading-relaxed line-clamp-4 whitespace-pre-wrap break-all">
                    {snippet.code}
                  </pre>
                </div>

                {/* Tags + date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {snippet.tags.slice(0, 3).map(({ tag }: { tag: { id: string; name: string } }) => (
                      <span key={tag.id} className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-zinc-600">{new Date(snippet.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ExplorePage
