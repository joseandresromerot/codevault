"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Code2, FolderOpen, Globe, Hash, LogOut, Settings } from "lucide-react"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "My Snippets", icon: Code2 },
  { href: "/dashboard/collections", label: "Collections", icon: FolderOpen },
  { href: "/dashboard/explore", label: "Explore", icon: Globe },
  { href: "/dashboard/tags", label: "Tags", icon: Hash },
]

type SidebarProps = {
  user: { name?: string | null; image?: string | null; email?: string | null }
}

export const Sidebar = ({ user }: SidebarProps) => {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex w-64 h-screen bg-zinc-900 border-r border-zinc-800 flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Code2 size={16} className="text-white" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">CodeVault</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === href
                ? "bg-emerald-500/10 text-emerald-400"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            )}
          >
            <Icon size={17} />
            {label}
          </Link>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-zinc-800 space-y-1">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <Settings size={17} />
          Settings
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors"
        >
          <LogOut size={17} />
          Sign out
        </button>

        <div className="flex items-center gap-3 px-3 py-3 mt-1">
          {user.image && (
            <img src={user.image} alt={user.name ?? ""} className="w-7 h-7 rounded-full ring-2 ring-zinc-700" />
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-zinc-500 truncate">{user.email}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
