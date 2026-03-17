import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="min-h-screen bg-zinc-950">
      <Sidebar user={session.user ?? {}} />
      <MobileNav user={session.user ?? {}} />
      <main className="md:ml-64 min-h-screen pt-14 md:pt-0 pb-16 md:pb-0">{children}</main>
    </div>
  )
}

export default DashboardLayout
