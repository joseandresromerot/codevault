"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Search, X } from "lucide-react"
import { SnippetsList } from "@/components/snippet/snippets-list"
import { cn } from "@/lib/utils"

const LANGUAGES = [
  "javascript", "typescript", "python", "rust", "go",
  "css", "html", "sql", "bash", "json", "other",
]

const DashboardPage = () => {
  const [search, setSearch] = useState("")
  const [language, setLanguage] = useState("")

  return (
    <div className="px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">My Snippets</h1>
          <p className="text-zinc-500 text-sm mt-1">Your personal code library</p>
        </div>
        <Link
          href="/dashboard/new"
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          New snippet
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search snippets..."
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

      <SnippetsList search={search} language={language} />
    </div>
  )
}

export default DashboardPage
