import { Hash } from "lucide-react"

const TagsPage = () => {
  return (
    <div className="px-8 py-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 border border-zinc-800">
        <Hash size={28} className="text-zinc-600" />
      </div>
      <h2 className="text-white font-semibold text-lg mb-1">Tags</h2>
      <p className="text-zinc-500 text-sm">Coming soon</p>
    </div>
  )
}

export default TagsPage
