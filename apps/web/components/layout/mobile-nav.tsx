"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Code2, FolderOpen, Globe, Hash } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Snippets", icon: Code2 },
  { href: "/dashboard/collections", label: "Collections", icon: FolderOpen },
  { href: "/dashboard/explore", label: "Explore", icon: Globe },
  { href: "/dashboard/tags", label: "Tags", icon: Hash },
]

type MobileNavProps = {
  user: { name?: string | null; image?: string | null }
}

export const MobileNav = ({ user }: MobileNavProps) => {
  const pathname = usePathname()

  return (
    <>
      {/* Top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-zinc-900 border-b border-zinc-800 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-emerald-500 rounded-md flex items-center justify-center">
            <Code2 size={13} className="text-white" />
          </div>
          <span className="font-bold text-white text-base tracking-tight">CodeVault</span>
        </div>
        {user.image && (
          <img src={user.image} alt={user.name ?? ""} className="w-7 h-7 rounded-full ring-2 ring-zinc-700" />
        )}
      </header>

      {/* Bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-900 border-t border-zinc-800 flex items-center">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-xs font-medium transition-colors",
                active ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
