import * as React from "react"
import { NavLink } from "react-router-dom"
import { LayoutDashboard, Wallet, Folder, Users, UserCircle } from "lucide-react"

interface NavItem {
  path: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/debts", label: "Debts", icon: Wallet },
  { path: "/folders", label: "Folders", icon: Folder },
  { path: "/contacts", label: "Contacts", icon: Users },
  { path: "/users", label: "Users", icon: UserCircle },
]

export default function Navlist() {
  return (
    <nav className="flex flex-col space-y-1.5 w-full">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 active:scale-95
              ${isActive
                ? "bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white shadow-md shadow-indigo-500/10 scale-[1.01]"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }
            `}
          >
            <Icon className="h-5.5 w-5.5" />
            <span>{item.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}