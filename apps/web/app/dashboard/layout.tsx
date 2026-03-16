import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="min-h-screen bg-zinc-950">
      <Sidebar user={session.user} />
      <main className="ml-64 min-h-screen">{children}</main>
    </div>
  )
}

export default DashboardLayout
