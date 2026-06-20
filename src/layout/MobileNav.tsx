import * as React from "react"
import { NavLink } from "react-router-dom"
import { LayoutDashboard, Wallet, Folder, Users, UserCircle } from "lucide-react"

export default function MobileNav() {
  return (
    <div className="fixed bottom-5 left-5 right-5 h-16 rounded-full border border-border/40 bg-background/80 backdrop-blur-xl shadow-2xl flex items-center justify-around px-4 lg:hidden z-40 transition-all duration-300">
      <NavLink
        to="/dashboard"
        className={({ isActive }) => `
          flex items-center justify-center transition-all duration-300 active:scale-90
          ${isActive 
            ? "h-12 w-12 rounded-full bg-gradient-to-tr from-[#3b82f6] via-[#8b5cf6] to-[#ec4899] text-white shadow-[0_8px_20px_rgba(99,102,241,0.35)] border border-white/10 -translate-y-3 scale-105" 
            : "h-10 w-10 text-muted-foreground hover:text-foreground"
          }
        `}
      >
        <LayoutDashboard className="h-5 w-5" />
      </NavLink>

      <NavLink
        to="/debts"
        className={({ isActive }) => `
          flex items-center justify-center transition-all duration-300 active:scale-90
          ${isActive 
            ? "h-12 w-12 rounded-full bg-gradient-to-tr from-[#3b82f6] via-[#8b5cf6] to-[#ec4899] text-white shadow-[0_8px_20px_rgba(99,102,241,0.35)] border border-white/10 -translate-y-3 scale-105" 
            : "h-10 w-10 text-muted-foreground hover:text-foreground"
          }
        `}
      >
        <Wallet className="h-5 w-5" />
      </NavLink>

      <NavLink
        to="/folders"
        className={({ isActive }) => `
          flex items-center justify-center transition-all duration-300 active:scale-90
          ${isActive 
            ? "h-12 w-12 rounded-full bg-gradient-to-tr from-[#3b82f6] via-[#8b5cf6] to-[#ec4899] text-white shadow-[0_8px_20px_rgba(99,102,241,0.35)] border border-white/10 -translate-y-3 scale-105" 
            : "h-10 w-10 text-muted-foreground hover:text-foreground"
          }
        `}
      >
        <Folder className="h-5 w-5" />
      </NavLink>

      <NavLink
        to="/contacts"
        className={({ isActive }) => `
          flex items-center justify-center transition-all duration-300 active:scale-90
          ${isActive 
            ? "h-12 w-12 rounded-full bg-gradient-to-tr from-[#3b82f6] via-[#8b5cf6] to-[#ec4899] text-white shadow-[0_8px_20px_rgba(99,102,241,0.35)] border border-white/10 -translate-y-3 scale-105" 
            : "h-10 w-10 text-muted-foreground hover:text-foreground"
          }
        `}
      >
        <Users className="h-5 w-5" />
      </NavLink>

      <NavLink
        to="/users"
        className={({ isActive }) => `
          flex items-center justify-center transition-all duration-300 active:scale-90
          ${isActive 
            ? "h-12 w-12 rounded-full bg-gradient-to-tr from-[#3b82f6] via-[#8b5cf6] to-[#ec4899] text-white shadow-[0_8px_20px_rgba(99,102,241,0.35)] border border-white/10 -translate-y-3 scale-105" 
            : "h-10 w-10 text-muted-foreground hover:text-foreground"
          }
        `}
      >
        <UserCircle className="h-5 w-5" />
      </NavLink>

    </div>
  )
}