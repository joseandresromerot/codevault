import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Plus, Search } from "lucide-react"
import { SnippetsList } from "@/components/snippet/snippets-list"

const DashboardPage = async () => {
  const session = await auth()
  if (!session) redirect("/login")

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
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          New snippet
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          placeholder="Search snippets..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
        />
      </div>

      <SnippetsList />
    </div>
  )
}

export default DashboardPage
