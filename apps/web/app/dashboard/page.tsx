import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

const DashboardPage = async () => {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">My Snippets</h1>
          <div className="flex items-center gap-3">
            {session.user?.image && (
              <img
                src={session.user.image}
                alt={session.user.name ?? "User"}
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="text-zinc-400 text-sm">{session.user?.name}</span>
          </div>
        </div>

        <div className="text-center py-20 text-zinc-500">
          <p className="text-lg">No snippets yet.</p>
          <p className="text-sm mt-1">Create your first snippet to get started.</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
