import Link from "next/link"
import { Code2 } from "lucide-react"

const NotFound = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-zinc-950 text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
        <Code2 size={28} className="text-emerald-400" />
      </div>
      <h1 className="text-white text-5xl font-bold mb-2">404</h1>
      <p className="text-zinc-500 text-sm mb-8">This page doesn't exist.</p>
      <Link
        href="/dashboard"
        className="bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
      >
        Back to dashboard
      </Link>
    </div>
  )
}

export default NotFound
