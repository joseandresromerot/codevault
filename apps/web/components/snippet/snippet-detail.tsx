"use client"

import { useQuery, useMutation } from "urql"
import { GET_SNIPPET, DELETE_SNIPPET } from "@/lib/graphql/snippets"
import { GET_COLLECTIONS, ADD_SNIPPET_TO_COLLECTION } from "@/lib/graphql/collections"
import { Copy, Check, Globe, Lock, ArrowLeft, Pencil, Trash2, FolderPlus, ChevronDown, MoreHorizontal, X } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

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
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [showCollections, setShowCollections] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const collectionsRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const mobileCollectionsRef = useRef<HTMLDivElement>(null)
  const [{ data, fetching }] = useQuery({ query: GET_SNIPPET, variables: { slug } })
  const [{ data: collectionsData }] = useQuery({ query: GET_COLLECTIONS })
  const [, deleteSnippet] = useMutation(DELETE_SNIPPET)
  const [, addToCollection] = useMutation(ADD_SNIPPET_TO_COLLECTION)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const inDesktopDropdown = collectionsRef.current?.contains(e.target as Node)
      const inMobileSheet = mobileCollectionsRef.current?.contains(e.target as Node)
      if (!inDesktopDropdown && !inMobileSheet) {
        setShowCollections(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setShowMobileMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const handleAddToCollection = async (collectionId: string) => {
    const { error } = await addToCollection({ collectionId, snippetId: data?.snippet?.id })
    if (error) { toast.error("Failed to add to collection"); return }
    toast.success("Added to collection")
    setShowCollections(false)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(data?.snippet?.code ?? "")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
      return
    }
    const { error } = await deleteSnippet({ id: data?.snippet?.id })
    if (error) { toast.error("Failed to delete snippet"); return }
    toast.success("Snippet deleted")
    router.push("/dashboard")
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const snippet = data?.snippet
  if (!snippet) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-3">
        <p className="text-white font-semibold text-lg">Snippet not found</p>
        <Link href="/dashboard" className="text-emerald-400 text-sm hover:underline">
          Back to dashboard
        </Link>
      </div>
    )
  }

  const langColor = LANGUAGE_COLORS[snippet.language.toLowerCase()] ?? "text-zinc-400 bg-zinc-400/10 border-zinc-400/20"

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Top bar */}
      <div className="border-b border-zinc-800 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm shrink-0"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Back</span>
        </Link>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={handleDelete}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border transition-colors",
              confirmDelete
                ? "bg-red-500/10 border-red-500 text-red-400"
                : "text-zinc-400 hover:text-red-400 border-zinc-700 hover:border-red-500/50"
            )}
          >
            <Trash2 size={14} />
            {confirmDelete ? "Confirm delete" : "Delete"}
          </button>

          <div className="relative" ref={collectionsRef}>
            <button
              onClick={() => setShowCollections(!showCollections)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-600 rounded-lg transition-colors"
            >
              <FolderPlus size={14} />
              Add to
              <ChevronDown size={12} />
            </button>
            {showCollections && (
              <div className="absolute right-0 top-full mt-1 w-52 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-10 overflow-hidden">
                {(collectionsData?.collections ?? []).length === 0 ? (
                  <div className="px-4 py-3 text-xs text-zinc-500 text-center">
                    No collections yet.{" "}
                    <Link href="/dashboard/collections" className="text-emerald-400 hover:underline">Create one</Link>
                  </div>
                ) : (
                  (collectionsData?.collections ?? []).map((col: any) => (
                    <button
                      key={col.id}
                      onClick={() => handleAddToCollection(col.id)}
                      className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                    >
                      {col.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <Link
            href={`/dashboard/edit/${snippet.id}`}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-600 rounded-lg transition-colors"
          >
            <Pencil size={14} />
            Edit
          </Link>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg transition-colors"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy code"}
          </button>
        </div>

        {/* Mobile actions */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg transition-colors"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy"}
          </button>
          <div className="relative" ref={mobileMenuRef}>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-1.5 text-zinc-400 hover:text-white border border-zinc-700 rounded-lg transition-colors"
            >
              <MoreHorizontal size={18} />
            </button>
            {showMobileMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-10 overflow-hidden">
                <Link
                  href={`/dashboard/edit/${snippet.id}`}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  <Pencil size={14} />
                  Edit
                </Link>
                <button
                  onClick={() => { setShowMobileMenu(false); setShowCollections(true) }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  <FolderPlus size={14} />
                  Add to collection
                </button>
                <div className="border-t border-zinc-800" />
                <button
                  onClick={() => { setShowMobileMenu(false); handleDelete() }}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors",
                    confirmDelete ? "text-red-400 bg-red-500/10" : "text-zinc-400 hover:bg-zinc-800 hover:text-red-400"
                  )}
                >
                  <Trash2 size={14} />
                  {confirmDelete ? "Confirm delete" : "Delete"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
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
                <span key={tag.id} className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
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

      {/* Mobile collections bottom sheet */}
      {showCollections && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowCollections(false)} />
          <div ref={mobileCollectionsRef} className="relative bg-zinc-900 border-t border-zinc-700 rounded-t-2xl p-4 pb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-sm">Add to collection</h3>
              <button onClick={() => setShowCollections(false)} className="text-zinc-500 hover:text-white">
                <X size={18} />
              </button>
            </div>
            {(collectionsData?.collections ?? []).length === 0 ? (
              <div className="text-center py-4">
                <p className="text-zinc-500 text-sm mb-3">No collections yet</p>
                <Link href="/dashboard/collections" className="text-emerald-400 text-sm hover:underline">
                  Create one
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                {(collectionsData?.collections ?? []).map((col: any) => (
                  <button
                    key={col.id}
                    onClick={() => handleAddToCollection(col.id)}
                    className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors"
                  >
                    {col.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
