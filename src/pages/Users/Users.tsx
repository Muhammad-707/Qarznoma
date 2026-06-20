import * as React from "react"
import { useTranslation } from "react-i18next"
import { 
  MoreHorizontal, 
  Edit3, 
  Trash2, 
  ShieldAlert, 
  Mail, 
  Clock, 
  ShieldCheck,
  Sparkles,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUsersStore, type ManagedUser } from "@/store/UsersStore"
import AddUserModal from "./AddUserModal"
import EditUserModal from "./EditUserModal"
import DeleteUserModal from "./DeleteUserModal"
function CardViewIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  )
}
function TableViewIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3" y2="18" />
      <line x1="9" y1="6" x2="9" y2="18" />
      <line x1="21" y1="6" x2="21" y2="18" />
    </svg>
  )
}
export default function Users() {
  const { t } = useTranslation()
  const {
    users,
    me,
    isLoading,
    fetchUsersData,
  } = useUsersStore()
  const [viewMode, setViewMode] = React.useState<"cards" | "table">("cards")
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [editingUser, setEditingUser] = React.useState<ManagedUser | null>(null)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null)
  const [toast, setToast] = React.useState<string | null>(null)
  React.useEffect(() => {
    fetchUsersData()
  }, [fetchUsersData])
  React.useEffect(() => {
    const handleOutsideClick = () => setActiveMenuId(null)
    window.addEventListener("click", handleOutsideClick)
    return () => window.removeEventListener("click", handleOutsideClick)
  }, [])
  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 4000)
  }
  const formatDate = (isoString: string) => {
    if (!isoString) return ""
    return new Date(isoString).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
  }
  return (
    <div className="w-full flex flex-col space-y-6 sm:space-y-8 animate-in fade-in duration-500 relative max-w-7xl mx-auto px-4 sm:px-6 pb-36 lg:pb-24 select-none">
      <style>{`
        @keyframes skeletonShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background: linear-gradient(
            90deg, 
            rgba(120, 120, 120, 0.05) 25%, 
            rgba(120, 120, 120, 0.18) 50%, 
            rgba(120, 120, 120, 0.05) 75%
          );
          background-size: 200% 100%;
          animation: skeletonShimmer 1.5s infinite linear;
        }
      `}</style>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
            {t("header.users")} 
            <Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />
          </h1>
          <p className="text-xs text-muted-foreground mt-1">{t("users.usersSubtitle")}</p>
        </div>
        <div className="flex items-center space-x-3.5">
          <div className="flex items-center bg-zinc-200/50 dark:bg-zinc-800/40 p-1 rounded-xl border border-border/60">
            <button
              onClick={() => setViewMode("cards")}
              className={`p-2 rounded-lg transition-all ${viewMode === "cards" ? "bg-background text-indigo-500 shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              title={t("folders.cardsView")}
            >
              <CardViewIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg transition-all ${viewMode === "table" ? "bg-background text-indigo-500 shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              title={t("folders.tableView")}
            >
              <TableViewIcon className="h-4 w-4" />
            </button>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="rounded-full bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white hover:scale-[1.03] transition-all duration-300 font-bold text-xs px-6 py-5 shadow-lg shadow-indigo-500/10 border-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("users.createUserBtn")}
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="relative border border-zinc-200/80 bg-zinc-200/50 dark:border-zinc-800/80 dark:bg-zinc-800/30 rounded-[32px] p-6 h-48 overflow-hidden flex flex-col justify-between">
              <div className="absolute inset-0 animate-shimmer" />
              <div className="h-10 w-10 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <div className="h-5 w-32 bg-zinc-300 dark:bg-zinc-700 rounded mt-3" />
              <div className="h-4.5 w-48 bg-zinc-300 dark:bg-zinc-700 rounded-lg mt-2" />
            </div>
          ))}
        </div>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user: ManagedUser) => {
            const isMe = me?.id === user.id
            const folderColor = user.role === "Admin" ? "#7c3aed" : "#00b4d8"
            const initials = user.name.split(" ").map(n => n.charAt(0)).join("").toUpperCase().slice(0, 2)
            return (
              <div
                key={user.id}
                style={{
                  boxShadow: `0 10px 30px -10px ${folderColor}25`,
                }}
                className="group border border-border/60 bg-background/55 backdrop-blur-md rounded-[32px] p-6 text-left relative flex flex-col justify-between hover:border-indigo-500/30 hover:scale-[1.01] transition-all duration-300 shadow-sm overflow-hidden"
              >
                <div style={{ backgroundColor: `${folderColor}04` }} className="absolute inset-0 transition-transform duration-500 group-hover:scale-105 pointer-events-none" />
                <div className="flex items-center justify-between relative z-10 w-full">
                  <div
                    style={{
                      backgroundColor: `${folderColor}15`,
                      border: `1.5px solid ${folderColor}35`,
                      color: folderColor,
                      boxShadow: `0 0 15px ${folderColor}30`,
                    }}
                    className="h-12 w-12 rounded-full flex items-center justify-center shrink-0 font-black text-sm"
                  >
                    {initials}
                  </div>
                  <div className="flex items-center space-x-1 relative shrink-0">
                    {user.id === me?.id && (
                      <span className="text-[8px] font-black uppercase bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-md border border-indigo-500/20">
                        {t("users.youBadge")}
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setActiveMenuId(activeMenuId === user.id ? null : user.id)
                      }}
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                    {activeMenuId === user.id && (
                      <div className="absolute right-0 top-9 bg-popover/95 backdrop-blur-md text-popover-foreground border border-border/50 rounded-xl shadow-xl py-1.5 w-32 z-30 animate-in fade-in-50 slide-in-from-top-1">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="w-full px-3 py-2 text-left text-xs font-semibold hover:bg-muted flex items-center gap-2"
                        >
                          <Edit3 className="h-3.5 w-3.5 text-blue-500" />
                          {t("dashboard.editRecordBtn")}
                        </button>
                        {!isMe && (
                          <button
                            onClick={() => setDeleteId(user.id)}
                            className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-500 hover:bg-rose-500/10 flex items-center gap-2"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            {t("dashboard.deleteBtn")}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 text-left">
                  <h3 className="text-xl font-black text-foreground tracking-tight truncate">
                    {user.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground font-semibold">
                    <Mail className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                    <span className="truncate max-w-[190px]">{user.email}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-6 w-full">
                  <div className="bg-zinc-500/5 border border-border/50 rounded-2xl p-2.5 flex flex-col items-center justify-center">
                    <span className="text-[9px] uppercase font-black tracking-wider text-muted-foreground flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5 text-indigo-500" /> {t("users.createdLabel")}
                    </span>
                    <span className="text-[10px] font-black mt-1 text-foreground truncate w-full text-center">
                      {formatDate(user.created_at)}
                    </span>
                  </div>
                  <div 
                    style={{
                      borderColor: `${folderColor}20`,
                      backgroundColor: `${folderColor}05`
                    }}
                    className="border rounded-2xl p-2.5 flex flex-col items-center justify-center"
                  >
                    <span className="text-[9px] uppercase font-black tracking-wider text-muted-foreground flex items-center gap-1">
                      {user.role === "Admin" ? (
                        <ShieldAlert style={{ color: folderColor }} className="h-2.5 w-2.5" />
                      ) : (
                        <ShieldCheck style={{ color: folderColor }} className="h-2.5 w-2.5" />
                      )}
                      {t("users.privilegeLabel")}
                    </span>
                    <span style={{ color: folderColor }} className="text-xs font-black mt-1">
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-transparent overflow-hidden relative z-10 w-full max-w-full">
          <div className="overflow-x-auto w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full text-left border-separate border-spacing-y-3 min-w-[600px]">
              <thead>
                <tr className="text-xs font-black uppercase text-muted-foreground tracking-wider h-12 bg-transparent select-none">
                  <th className="pl-6 py-3 w-1/3">{t("users.userProfileTh")}</th>
                  <th className="py-3 w-1/4">{t("auth.email")}</th>
                  <th className="py-3 w-28 text-left hidden sm:table-cell">{t("users.createdDateTh")}</th>
                  <th className="py-3 text-center w-24">{t("users.roleTh")}</th>
                  <th className="pr-6 py-3 text-right w-16">{t("folders.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: ManagedUser) => {
                  const isMe = me?.id === user.id
                  const folderColor = user.role === "Admin" ? "#7c3aed" : "#00b4d8"
                  const initials = user.name.split(" ").map(n => n.charAt(0)).join("").toUpperCase().slice(0, 2)
                  return (
                    <tr key={user.id} className="group hover:scale-[1.005] transition-all h-14 text-sm font-semibold">
                      <td className="pl-6 py-3 bg-background/55 backdrop-blur-md rounded-l-2xl border-l border-y border-border/40 group-hover:bg-muted/10 transition-colors">
                        <div className="flex items-center space-x-3.5">
                          <div 
                            style={{ backgroundColor: `${folderColor}15`, color: folderColor, border: `1px solid ${folderColor}25` }}
                            className="h-9 w-9 rounded-full font-black text-xs flex items-center justify-center shrink-0"
                          >
                            {initials}
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="font-black text-foreground">{user.name}</span>
                            {user.id === me?.id && (
                              <span className="text-[7.5px] uppercase font-black bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 rounded px-1 self-start mt-0.5">
                                {t("users.youBadge")}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 bg-background/55 backdrop-blur-md border-y border-border/40 group-hover:bg-muted/10 transition-colors text-muted-foreground truncate max-w-[200px]">
                        {user.email}
                      </td>
                      <td className="py-3 bg-background/55 backdrop-blur-md border-y border-border/40 group-hover:bg-muted/10 transition-colors text-muted-foreground/80 font-medium hidden sm:table-cell">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="py-3 bg-background/55 backdrop-blur-md border-y border-border/40 group-hover:bg-muted/10 transition-colors text-center">
                        <span 
                          style={{ color: folderColor, backgroundColor: `${folderColor}12`, borderColor: `${folderColor}25` }}
                          className="text-[9px] border px-2 py-0.5 rounded-md font-extrabold uppercase tracking-wider"
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="pr-6 py-3 bg-background/55 backdrop-blur-md rounded-r-2xl border-r border-y border-border/40 group-hover:bg-muted/10 transition-colors text-right relative">
                        <div className="flex items-center justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingUser(user)}
                            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          {!isMe && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteId(user.id)}
                              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <AddUserModal 
        isOpen={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
        onSuccess={(msg) => showToast(msg)}
      />
      <EditUserModal 
        user={editingUser} 
        onOpenChange={(open) => !open && setEditingUser(null)} 
        onSuccess={(msg) => showToast(msg)}
      />
      <DeleteUserModal 
        userId={deleteId} 
        onOpenChange={(open) => !open && setDeleteId(null)} 
        onSuccess={(msg) => showToast(msg)}
      />
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] border border-white/20 px-5 py-3.5 shadow-[0_10px_35px_rgba(99,102,241,0.25)] flex items-center gap-3 rounded-2xl animate-in slide-in-from-top-5 duration-300">
          <span className="h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-pulse" />
          <span className="text-xs font-bold text-white tracking-wide">{toast}</span>
        </div>
      )}
    </div>
  )
}
function isOurs(id: string, meId?: string) {
  if (!meId) return false
  return id === meId
}