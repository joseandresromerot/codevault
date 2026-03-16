"use client"

import { useQuery } from "urql"
import { GET_SNIPPETS } from "@/lib/graphql/snippets"
import { SnippetCard } from "./snippet-card"
import { Code2 } from "lucide-react"
import Link from "next/link"

export const SnippetsList = () => {
  const [{ data, fetching }] = useQuery({ query: GET_SNIPPETS })

  if (fetching) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl h-52 animate-pulse" />
        ))}
      </div>
    )
  }

  const snippets = data?.snippets ?? []

  if (snippets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 border border-zinc-800">
          <Code2 size={28} className="text-zinc-600" />
        </div>
        <h3 className="text-white font-semibold text-lg mb-1">No snippets yet</h3>
        <p className="text-zinc-500 text-sm mb-6">Save your first code snippet to get started</p>
        <Link
          href="/dashboard/new"
          className="bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          Create snippet
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {snippets.map((snippet: any) => (
        <SnippetCard key={snippet.id} {...snippet} />
      ))}
    </div>
  )
}
