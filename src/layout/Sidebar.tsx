import * as React from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { LogOut } from "lucide-react"
import { useLoginStore } from "@/store/AuthStore/LoginStore"
import Navlist from "../components/shared/Navlist"
export default function Sidebar() {
  const { user, logout } = useLoginStore()
  const { t } = useTranslation()
  const userInitials = user?.name ? user.name.charAt(0).toUpperCase() : "M"
  return (
    <aside className="fixed top-0 bottom-0 left-0 w-64 border-r border-border/50 bg-background px-6 py-6 flex flex-col justify-between z-20 hidden lg:flex">
      <div className="flex flex-col space-y-8">
        <Link to="/dashboard" className="flex items-center space-x-3 group self-start">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] via-[#8b5cf6] to-[#ec4899] text-white font-black text-base shadow-sm">
            A
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground flex items-center gap-1">
            Ad1 <span className="bg-gradient-to-r from-[#3b82f6] to-[#ec4899] bg-clip-text text-transparent font-extrabold">5:8</span>
          </span>
        </Link>
        <Navlist />
      </div>
      <div className="border border-border/60 bg-muted/20 rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <Link 
          to="/profile" 
          className="flex items-center space-x-3 group/profile cursor-pointer shrink-0"
        >
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#ec4899] text-white text-xs font-black flex items-center justify-center transition-transform group-hover/profile:scale-105 shadow-sm">
            {userInitials}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-foreground leading-none group-hover/profile:text-[#3b82f6] transition-colors truncate max-w-[110px]">
              {user?.name || "Muhammad"}
            </span>
            <span className="text-[10px] text-muted-foreground font-semibold mt-1">
              {t("auth.vaultTitle") ? "Owner" : "Owner"}
            </span>
          </div>
        </Link>
        <button 
          onClick={() => logout()}
          className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 active:scale-95 transition-all shrink-0"
          aria-label="Logout"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  )
}