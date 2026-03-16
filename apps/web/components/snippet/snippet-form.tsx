"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "urql"
import { toast } from "sonner"
import { X } from "lucide-react"
import { CodeEditor } from "./code-editor"
import { CREATE_SNIPPET, UPDATE_SNIPPET } from "@/lib/graphql/snippets"
import { cn } from "@/lib/utils"

const LANGUAGES = [
  "javascript", "typescript", "python", "rust", "go",
  "css", "html", "sql", "bash", "json", "other",
]

type SnippetFormProps = {
  initialData?: {
    id: string
    title: string
    description?: string | null
    code: string
    language: string
    visibility: "PUBLIC" | "PRIVATE"
    tags: { tag: { name: string } }[]
  }
}

export const SnippetForm = ({ initialData }: SnippetFormProps) => {
  const router = useRouter()
  const isEditing = !!initialData

  const [title, setTitle] = useState(initialData?.title ?? "")
  const [description, setDescription] = useState(initialData?.description ?? "")
  const [code, setCode] = useState(initialData?.code ?? "")
  const [language, setLanguage] = useState(initialData?.language ?? "typescript")
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">(initialData?.visibility ?? "PRIVATE")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>(initialData?.tags.map((t) => t.tag.name) ?? [])

  const [, createSnippet] = useMutation(CREATE_SNIPPET)
  const [, updateSnippet] = useMutation(UPDATE_SNIPPET)

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      const tag = tagInput.trim().toLowerCase()
      if (tag && !tags.includes(tag)) setTags([...tags, tag])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !code.trim()) {
      toast.error("Title and code are required")
      return
    }

    const input = { title, description: description || null, code, language, visibility, tags }

    if (isEditing) {
      const { error } = await updateSnippet({ id: initialData.id, input })
      if (error) { toast.error("Failed to update snippet"); return }
      toast.success("Snippet updated")
    } else {
      const { data, error } = await createSnippet({ input })
      if (error) { toast.error("Failed to create snippet"); return }
      toast.success("Snippet created")
      router.push(`/s/${data.createSnippet.slug}`)
      return
    }

    router.refresh()
    router.back()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-300">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My awesome snippet..."
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-300">Description <span className="text-zinc-500">(optional)</span></label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What does this snippet do?"
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Language + Visibility */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-300">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-300">Visibility</label>
          <div className="flex rounded-lg border border-zinc-700 overflow-hidden">
            {(["PRIVATE", "PUBLIC"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVisibility(v)}
                className={cn(
                  "flex-1 py-2.5 text-sm font-medium transition-colors",
                  visibility === v
                    ? "bg-indigo-500 text-white"
                    : "bg-zinc-900 text-zinc-400 hover:text-white"
                )}
              >
                {v.charAt(0) + v.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Code editor */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-300">Code</label>
        <CodeEditor value={code} language={language} onChange={setCode} minHeight="280px" />
      </div>

      {/* Tags */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-300">Tags</label>
        <div className="flex flex-wrap gap-2 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 focus-within:border-indigo-500 transition-colors min-h-[44px]">
          {tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 bg-indigo-500/10 text-indigo-400 text-xs px-2 py-1 rounded-full">
              #{tag}
              <button type="button" onClick={() => removeTag(tag)}>
                <X size={11} />
              </button>
            </span>
          ))}
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={addTag}
            placeholder={tags.length === 0 ? "Add tags (press Enter)..." : ""}
            className="flex-1 min-w-24 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {isEditing ? "Save changes" : "Create snippet"}
        </button>
      </div>
    </form>
  )
}
