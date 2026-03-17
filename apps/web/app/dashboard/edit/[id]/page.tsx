"use client"

import { useQuery } from "urql"
import { GET_SNIPPET_BY_ID } from "@/lib/graphql/snippets"
import { SnippetForm } from "@/components/snippet/snippet-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { use } from "react"

type Props = {
  params: Promise<{ id: string }>
}

const EditSnippetPage = ({ params }: Props) => {
  const { id } = use(params)
  const [{ data, fetching }] = useQuery({ query: GET_SNIPPET_BY_ID, variables: { id } })

  if (fetching) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const snippet = data?.snippetById
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

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href={`/s/${snippet.slug}`}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
        <span className="text-zinc-700">/</span>
        <h1 className="text-xl font-bold text-white">Edit snippet</h1>
      </div>

      <SnippetForm initialData={snippet} />
    </div>
  )
}

export default EditSnippetPage
