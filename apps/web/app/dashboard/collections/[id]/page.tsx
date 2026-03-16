"use client"

import { use } from "react"
import { useQuery, useMutation } from "urql"
import { GET_COLLECTION, REMOVE_SNIPPET_FROM_COLLECTION } from "@/lib/graphql/collections"
import { ArrowLeft, Code2, Globe, Lock, X } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
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

type Props = {
  params: Promise<{ id: string }>
}

const CollectionDetailPage = ({ params }: Props) => {
  const { id } = use(params)

  const [{ data, fetching }, refetch] = useQuery({
    query: GET_COLLECTION,
    variables: { id },
    requestPolicy: "cache-and-network",
  })
  const [, removeSnippet] = useMutation(REMOVE_SNIPPET_FROM_COLLECTION)

  const handleRemove = async (snippetId: string) => {
    const { error } = await removeSnippet({ collectionId: id, snippetId })
    if (error) { toast.error("Failed to remove snippet"); return }
    toast.success("Snippet removed")
    refetch({ requestPolicy: "network-only" })
  }

  if (fetching && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const collection = data?.collection
  if (!collection) {
    return (
      <div className="px-8 py-8 flex flex-col items-center justify-center gap-3">
        <p className="text-white font-semibold">Collection not found</p>
        <Link href="/dashboard/collections" className="text-emerald-400 text-sm hover:underline">Back to collections</Link>
      </div>
    )
  }

  const snippets = collection.snippets.map((item: any) => item.snippet)

  return (
    <div className="px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/collections"
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm mb-4 w-fit"
        >
          <ArrowLeft size={16} />
          Collections
        </Link>
        <h1 className="text-2xl font-bold text-white">{collection.name}</h1>
        {collection.description && (
          <p className="text-zinc-500 text-sm mt-1">{collection.description}</p>
        )}
        <p className="text-zinc-600 text-xs mt-2">
          {snippets.length} {snippets.length === 1 ? "snippet" : "snippets"}
        </p>
      </div>

      {snippets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 border border-zinc-800">
            <Code2 size={28} className="text-zinc-600" />
          </div>
          <h3 className="text-white font-semibold text-lg mb-1">No snippets in this collection</h3>
          <p className="text-zinc-500 text-sm mb-6">Open any snippet and add it to this collection</p>
          <Link
            href="/dashboard"
            className="bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            Browse snippets
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {snippets.map((snippet: any) => {
            const langColor = LANGUAGE_COLORS[snippet.language.toLowerCase()] ?? "text-zinc-400 bg-zinc-400/10 border-zinc-400/20"
            return (
              <div key={snippet.id} className="group bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full border", langColor)}>
                    {snippet.language}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs text-zinc-600">
                      {snippet.visibility === "PUBLIC" ? <Globe size={11} /> : <Lock size={11} />}
                    </span>
                    <button
                      onClick={() => handleRemove(snippet.id)}
                      className="p-1 text-zinc-600 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors"
                      title="Remove from collection"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                <Link href={`/s/${snippet.slug}`} className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {snippet.title}
                  </h3>
                  {snippet.description && (
                    <p className="text-zinc-500 text-xs mt-1 line-clamp-2">{snippet.description}</p>
                  )}
                </Link>

                <div className="bg-zinc-950 rounded-lg p-3 overflow-hidden">
                  <pre className="text-xs text-zinc-400 font-mono leading-relaxed line-clamp-3 whitespace-pre-wrap break-all">
                    {snippet.code}
                  </pre>
                </div>

                {snippet.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {snippet.tags.slice(0, 3).map(({ tag }: { tag: { id: string; name: string } }) => (
                      <span key={tag.id} className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CollectionDetailPage
