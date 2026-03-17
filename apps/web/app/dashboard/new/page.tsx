import { SnippetForm } from "@/components/snippet/snippet-form"

const NewSnippetPage = () => {
  return (
    <div className="px-4 py-6 md:px-8 md:py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">New Snippet</h1>
        <p className="text-zinc-500 text-sm mt-1">Save a piece of code for later</p>
      </div>

      <SnippetForm />
    </div>
  )
}

export default NewSnippetPage
