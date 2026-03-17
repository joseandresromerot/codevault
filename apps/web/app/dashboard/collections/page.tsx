"use client"

import { useState } from "react"
import { useQuery, useMutation } from "urql"
import { GET_COLLECTIONS, CREATE_COLLECTION, DELETE_COLLECTION } from "@/lib/graphql/collections"
import { FolderOpen, Plus, Trash2, X, Code2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const LANGUAGE_COLORS: Record<string, string> = {
  javascript: "bg-yellow-400",
  typescript: "bg-blue-400",
  python: "bg-green-400",
  rust: "bg-orange-400",
  go: "bg-cyan-400",
  css: "bg-pink-400",
  html: "bg-red-400",
  sql: "bg-purple-400",
  bash: "bg-zinc-400",
  json: "bg-lime-400",
}

const CollectionsPage = () => {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const [{ data, fetching }, refetch] = useQuery({
    query: GET_COLLECTIONS,
    requestPolicy: "cache-and-network",
  })
  const [, createCollection] = useMutation(CREATE_COLLECTION)
  const [, deleteCollection] = useMutation(DELETE_COLLECTION)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    const { error } = await createCollection({ input: { name, description: description || null } })
    if (error) { toast.error("Failed to create collection"); return }
    toast.success("Collection created")
    setName("")
    setDescription("")
    setShowForm(false)
    refetch({ requestPolicy: "network-only" })
  }

  const handleDelete = async (id: string) => {
    if (confirmDelete !== id) {
      setConfirmDelete(id)
      setTimeout(() => setConfirmDelete(null), 3000)
      return
    }
    const { error } = await deleteCollection({ id })
    if (error) { toast.error("Failed to delete collection"); return }
    toast.success("Collection deleted")
    setConfirmDelete(null)
    refetch({ requestPolicy: "network-only" })
  }

  const collections = data?.collections ?? []

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Collections</h1>
          <p className="text-zinc-500 text-sm mt-1">Organize your snippets into groups</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          New collection
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">New collection</h3>
            <button onClick={() => setShowForm(false)} className="text-zinc-500 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleCreate} className="space-y-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Collection name..."
              autoFocus
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)..."
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium rounded-lg transition-colors">
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Collections grid */}
      {fetching && collections.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl h-36 animate-pulse" />
          ))}
        </div>
      ) : collections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 border border-zinc-800">
            <FolderOpen size={28} className="text-zinc-600" />
          </div>
          <h3 className="text-white font-semibold text-lg mb-1">No collections yet</h3>
          <p className="text-zinc-500 text-sm mb-6">Group your snippets into organized collections</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            Create collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {collections.map((col: any) => {
            const snippetCount = col.snippets.length
            const languages = [...new Set(col.snippets.map((s: any) => s.snippet.language))] as string[]

            return (
              <div key={col.id} className="group bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <Link href={`/dashboard/collections/${col.id}`} className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold group-hover:text-emerald-400 transition-colors truncate">
                      {col.name}
                    </h3>
                    {col.description && (
                      <p className="text-zinc-500 text-xs mt-1 line-clamp-2">{col.description}</p>
                    )}
                  </Link>
                  <button
                    onClick={() => handleDelete(col.id)}
                    className={cn(
                      "ml-2 p-1.5 rounded-lg transition-colors flex-shrink-0",
                      confirmDelete === col.id
                        ? "bg-red-500/10 text-red-400"
                        : "text-zinc-600 hover:text-red-400 hover:bg-zinc-800"
                    )}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <Link href={`/dashboard/collections/${col.id}`} className="flex-1">
                  {/* Language dots */}
                  {languages.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {languages.slice(0, 6).map((lang) => (
                        <span
                          key={lang}
                          className={cn("w-2 h-2 rounded-full", LANGUAGE_COLORS[lang] ?? "bg-zinc-500")}
                          title={lang}
                        />
                      ))}
                    </div>
                  )}
                </Link>

                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <Code2 size={12} />
                  <span>{snippetCount} {snippetCount === 1 ? "snippet" : "snippets"}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CollectionsPage
