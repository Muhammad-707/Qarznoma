import * as React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { FolderOpen, MoreHorizontal, Trash2, Edit3, Plus, FolderMinus, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFoldersStore, type Folder } from "@/store/FoldersStore"
import AddFolderModal from "./AddFolderModal"
import EditFolderModal from "./EditFolderModal"
import DeleteFolderModal from "./DeleteFolderModal"
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
export default function Folders() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const {
    folders,
    contacts,
    debts,
    paymentsMap,
    isLoading,
    fetchFoldersPageData,
  } = useFoldersStore()
  const [viewMode, setViewMode] = React.useState<"cards" | "table">(() => {
    return (localStorage.getItem("foldersViewMode") as "cards" | "table") || "cards"
  })
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [editingFolder, setEditingFolder] = React.useState<Folder | null>(null)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null)
  const [toast, setToast] = React.useState<string | null>(null)
  React.useEffect(() => {
    fetchFoldersPageData()
  }, [fetchFoldersPageData])
  React.useEffect(() => {
    localStorage.setItem("foldersViewMode", viewMode)
  }, [viewMode])
  React.useEffect(() => {
    const handleOutsideClick = () => setActiveMenuId(null)
    window.addEventListener("click", handleOutsideClick)
    return () => window.removeEventListener("click", handleOutsideClick)
  }, [])
  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 4000)
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
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">{t("header.folders")}</h1>
            <Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{t("folders.foldersSubtitle")}</p>
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
            {t("folders.addFolderBtn")}
          </Button>
        </div>
      </div>
      {isLoading ? (
        viewMode === "cards" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="relative border border-zinc-200/80 bg-zinc-200/50 dark:border-zinc-800/80 dark:bg-zinc-800/30 rounded-[32px] p-6 h-56 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div className="absolute inset-0 animate-shimmer" />
                <div className="flex justify-between items-start">
                  <div className="h-12 w-12 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <div className="h-6 w-6 rounded bg-zinc-300 dark:bg-zinc-700" />
                </div>
                <div className="flex flex-col space-y-2 mt-4 text-left">
                  <div className="h-5 w-32 bg-zinc-300 dark:bg-zinc-700 rounded" />
                  <div className="h-3.5 w-16 bg-zinc-300 dark:bg-zinc-700 rounded" />
                </div>
                <div className="flex space-x-3 mt-6">
                  <div className="h-12 bg-zinc-300/60 dark:bg-zinc-700/60 rounded-2xl flex-1" />
                  <div className="h-12 bg-zinc-300/60 dark:bg-zinc-700/60 rounded-2xl flex-1" />
                  <div className="h-12 bg-zinc-300/60 dark:bg-zinc-700/80 rounded-xl flex-1" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full text-left border-separate border-spacing-y-3 min-w-[600px]">
              <thead>
                <tr className="text-xs font-black uppercase text-muted-foreground tracking-wider h-12 bg-transparent select-none">
                  <th className="pl-6 py-3 w-1/3">{t("folders.nameLabel")}</th>
                  <th className="py-3 w-24 text-center">{t("folders.total")}</th>
                  <th className="py-3 w-24 text-center">{t("folders.owes")}</th>
                  <th className="py-3 w-24 text-center">{t("folders.iOwe")}</th>
                  <th className="pr-6 py-3 text-right w-16">{t("folders.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="h-14">
                    <td className="pl-6 py-3 bg-zinc-200/50 dark:bg-zinc-800/30 rounded-l-2xl border-l border-y border-border/40 overflow-hidden relative">
                      <div className="absolute inset-0 animate-shimmer" />
                      <div className="flex items-center space-x-3.5">
                        <div className="h-9 w-9 rounded-full bg-zinc-300 dark:bg-zinc-700 shrink-0" />
                        <div className="h-4 w-32 bg-zinc-300 dark:bg-zinc-700 rounded" />
                      </div>
                    </td>
                    <td className="py-3 bg-zinc-200/50 dark:bg-zinc-800/30 border-y border-border/40 overflow-hidden relative text-center">
                      <div className="absolute inset-0 animate-shimmer" />
                      <div className="h-4 w-12 bg-zinc-300 dark:bg-zinc-700 rounded mx-auto" />
                    </td>
                    <td className="py-3 bg-zinc-200/50 dark:bg-zinc-800/30 border-y border-border/40 overflow-hidden relative text-center">
                      <div className="absolute inset-0 animate-shimmer" />
                      <div className="h-4 w-12 bg-zinc-300 dark:bg-zinc-700 rounded mx-auto" />
                    </td>
                    <td className="py-3 bg-zinc-200/50 dark:bg-zinc-800/30 border-y border-border/40 overflow-hidden relative text-center">
                      <div className="absolute inset-0 animate-shimmer" />
                      <div className="h-4 w-12 bg-zinc-300 dark:bg-zinc-700 rounded mx-auto" />
                    </td>
                    <td className="pr-6 py-3 bg-zinc-200/50 dark:bg-zinc-800/30 rounded-r-2xl border-r border-y border-border/40 overflow-hidden relative text-right">
                      <div className="absolute inset-0 animate-shimmer" />
                      <div className="flex items-center justify-end space-x-2">
                        <div className="h-8 w-8 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
                        <div className="h-8 w-8 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : folders.length > 0 ? (
        viewMode === "cards" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {folders.map((folder: Folder) => {
              const folderContacts = contacts.filter((c: any) => c.folder_id === folder.id)
              const contactIds = folderContacts.map((c: any) => c.id)
              const folderDebts = debts.filter((d: any) => contactIds.includes(d.contact_id))
              const debtCount = folderDebts.length
              let totalVal = 0
              let owesMeVal = 0
              let iOweVal = 0
              folderDebts.forEach((debt: any) => {
                const paidAmount = Number(paymentsMap[debt.id]) || 0
                const debtAmount = Number(debt.amount) || 0
                const remaining = Math.max(debtAmount - paidAmount, 0)
                if (debt.status !== "paid") {
                  if (debt.direction === "they_owe_me") {
                    owesMeVal += remaining
                  } else {
                    iOweVal += remaining
                  }
                }
                totalVal += debtAmount
              })
              return (
                <Link
                  to={`/debts?folder_id=${folder.id}`}
                  key={folder.id}
                  style={{
                    boxShadow: `0 10px 30px -10px ${folder.color}25`,
                  }}
                  className="group border border-border/60 bg-background/55 backdrop-blur-md rounded-[32px] p-6 text-left relative flex flex-col justify-between hover:border-indigo-500/30 hover:scale-[1.01] transition-all duration-300 shadow-sm cursor-pointer"
                >
                  <div className="flex items-center justify-between relative">
                    <div
                      style={{
                        backgroundColor: `${folder.color}15`,
                        border: `1.5px solid ${folder.color}35`,
                        color: folder.color,
                        boxShadow: `0 0 15px ${folder.color}30`,
                      }}
                      className="h-12 w-12 rounded-full flex items-center justify-center shrink-0"
                    >
                      <FolderOpen className="h-5 w-5" />
                    </div>
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setActiveMenuId(activeMenuId === folder.id ? null : folder.id)
                        }}
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                      {activeMenuId === folder.id && (
                        <div className="absolute right-0 top-9 bg-popover text-popover-foreground border border-border/60 rounded-xl shadow-xl py-1.5 w-32 z-30 animate-in fade-in-50 slide-in-from-top-1">
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setEditingFolder(folder)
                            }}
                            className="w-full px-3 py-2 text-left text-xs font-semibold hover:bg-muted flex items-center gap-2"
                          >
                            <Edit3 className="h-3.5 w-3.5 text-blue-500" />
                            {t("folders.editFolderTitle")}
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setDeleteId(folder.id)
                            }}
                            className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-500 hover:bg-rose-500/10 flex items-center gap-2"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            {t("folders.deleteBtn")}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-xl font-black text-foreground tracking-tight truncate">
                      {folder.name}
                    </h3>
                    <span className="text-xs text-muted-foreground font-semibold mt-1 block">
                      {debtCount} {debtCount === 1 ? t("folders.debtSingle") : t("folders.debtPlural")}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-6">
                    <div className="bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/15 text-blue-500 rounded-2xl p-2.5 flex flex-col items-center justify-center">
                      <span className="text-[9px] uppercase font-black tracking-wider text-muted-foreground">{t("folders.total")}</span>
                      <span className="text-xs sm:text-sm font-black mt-1">${totalVal}</span>
                    </div>
                    <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/15 text-emerald-500 rounded-2xl p-2.5 flex flex-col items-center justify-center">
                      <span className="text-[9px] uppercase font-black tracking-wider text-muted-foreground">{t("folders.owes")}</span>
                      <span className="text-xs sm:text-sm font-black mt-1">${owesMeVal}</span>
                    </div>
                    <div className="bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/15 text-rose-500 rounded-2xl p-2.5 flex flex-col items-center justify-center">
                      <span className="text-[9px] uppercase font-black tracking-wider text-muted-foreground">{t("folders.iOwe")}</span>
                      <span className="text-xs sm:text-sm font-black mt-1">${iOweVal}</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="bg-transparent overflow-hidden relative z-10 w-full max-w-full">
            <div className="overflow-x-auto w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <table className="w-full text-left border-separate border-spacing-y-3 min-w-[600px]">
                <thead>
                  <tr className="text-xs font-black uppercase text-muted-foreground tracking-wider h-12 bg-transparent select-none">
                    <th className="pl-6 py-3 w-1/3">{t("folders.nameLabel")}</th>
                    <th className="py-3 w-24 text-center">{t("folders.total")}</th>
                    <th className="py-3 w-24 text-center">{t("folders.owes")}</th>
                    <th className="py-3 w-24 text-center">{t("folders.iOwe")}</th>
                    <th className="pr-6 py-3 text-right w-16">{t("folders.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {folders.map((folder: Folder) => {
                    const folderContacts = contacts.filter((c: any) => c.folder_id === folder.id)
                    const contactIds = folderContacts.map((c: any) => c.id)
                    const folderDebts = debts.filter((d: any) => contactIds.includes(d.contact_id))
                    const debtCount = folderDebts.length
                    let totalVal = 0
                    let owesMeVal = 0
                    let iOweVal = 0
                    folderDebts.forEach((debt: any) => {
                      const paidAmount = Number(paymentsMap[debt.id]) || 0
                      const debtAmount = Number(debt.amount) || 0
                      const remaining = Math.max(debtAmount - paidAmount, 0)
                      if (debt.status !== "paid") {
                        if (debt.direction === "they_owe_me") {
                          owesMeVal += remaining
                        } else {
                          iOweVal += remaining
                        }
                      }
                      totalVal += debtAmount
                    })
                    return (
                      <tr
                        key={folder.id}
                        className="group hover:scale-[1.005] transition-all h-14 text-sm font-semibold cursor-pointer relative"
                        onClick={() => navigate(`/debts?folder_id=${folder.id}`)}
                      >
                        <td className="pl-6 py-3 bg-background/55 backdrop-blur-md rounded-l-2xl border-l border-y border-border/40 group-hover:bg-muted/10 transition-colors">
                          <div className="flex items-center space-x-3.5">
                            <div
                              style={{
                                backgroundColor: `${folder.color}15`,
                                color: folder.color,
                                border: `1px solid ${folder.color}25`
                              }}
                              className="h-9 w-9 rounded-full font-black text-xs flex items-center justify-center shrink-0"
                            >
                              <FolderOpen className="h-4.5 w-4.5" />
                            </div>
                            <div className="flex flex-col text-left">
                              <span className="font-black text-foreground">{folder.name}</span>
                              <span className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                                {debtCount} {debtCount === 1 ? t("folders.debtSingle") : t("folders.debtPlural")}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 bg-background/55 backdrop-blur-md border-y border-border/40 group-hover:bg-muted/10 transition-colors text-center text-blue-500 font-extrabold">
                          ${totalVal}
                        </td>
                        <td className="py-3.5 bg-background/55 backdrop-blur-md border-y border-border/40 group-hover:bg-muted/10 transition-colors text-center text-emerald-500 font-extrabold">
                          ${owesMeVal}
                        </td>
                        <td className="py-3.5 bg-background/55 backdrop-blur-md border-y border-border/40 group-hover:bg-muted/10 transition-colors text-center text-rose-500 font-extrabold">
                          ${iOweVal}
                        </td>
                        <td
                          className="pr-6 py-3.5 bg-background/55 backdrop-blur-md rounded-r-2xl border-r border-y border-border/40 group-hover:bg-muted/10 transition-colors text-right relative"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingFolder(folder)}
                              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteId(folder.id)}
                              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        <div className="col-span-full border border-border/60 bg-background/55 backdrop-blur-md rounded-[32px] p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-5 shadow-sm min-h-[350px]">
          <div className="h-16 w-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center shadow-inner">
            <FolderMinus className="h-7 w-7" />
          </div>
          <div className="space-y-1.5 max-w-sm">
            <h4 className="text-base sm:text-lg font-black text-foreground tracking-tight">{t("folders.noFoldersTitle")}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("folders.noFoldersDesc")}
            </p>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="rounded-full bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] hover:scale-[1.03] transition-all duration-300 font-bold text-xs px-8 py-5 shadow-lg shadow-indigo-500/25 border-0 mt-2 text-white"
          >
            {t("folders.createFirstFolderBtn")}
          </Button>
        </div>
      )}
      <AddFolderModal
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={(msg) => showToast(msg)}
      />
      <EditFolderModal
        folder={editingFolder}
        onOpenChange={(open) => !open && setEditingFolder(null)}
        onSuccess={(msg) => showToast(msg)}
      />
      <DeleteFolderModal
        folderId={deleteId}
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