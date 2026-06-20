import * as React from "react"
import { useSearchParams, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Phone, 
  Mail, 
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  X,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useContactsStore, type Contact } from "@/store/ContactsStore"
import AddContactModal from "./AddContactModal"
import EditContactModal from "./EditContactModal"
import DeleteContactModal from "./DeleteContactModal"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
function EditIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}
function TrashIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  )
}
function UserMinusIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="22" x2="16" y1="11" y2="11" />
    </svg>
  )
}
function LayersIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  )
}
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
export default function Contacts() {
  const { t } = useTranslation()
  const {
    contacts,
    folders,
    debts,
    paymentsMap,
    isLoading,
    fetchContactsPageData,
  } = useContactsStore()
  const [viewMode, setViewMode] = React.useState<"cards" | "table">(
    () => {
      const saved = localStorage.getItem("contacts-view-mode")
      return (saved === "table" || saved === "cards") ? saved : "cards"
    }
  )
  React.useEffect(() => {
    localStorage.setItem("contacts-view-mode", viewMode)
  }, [viewMode])
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [editingContact, setEditingContact] = React.useState<Contact | null>(null)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null)
  const [toast, setToast] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedFolderId, setSelectedFolderId] = React.useState<string>("all")
  const [isFolderPickerOpen, setIsFolderPickerOpen] = React.useState(false)
  const [folderSearchQuery, setFolderSearchQuery] = React.useState("")
  React.useEffect(() => {
    fetchContactsPageData()
  }, [fetchContactsPageData])
  React.useEffect(() => {
    const handleOutsideClick = () => setActiveMenuId(null)
    window.addEventListener("click", handleOutsideClick)
    return () => window.removeEventListener("click", handleOutsideClick)
  }, [])
  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 4000)
  }
  const getContactCountInFolder = (folderId: string) => {
    return contacts.filter(c => c.folder_id === folderId).length
  }
  const filteredFoldersForPicker = folders.filter(f => 
    f.name.toLowerCase().includes(folderSearchQuery.toLowerCase())
  )
  const filteredContacts = contacts.filter((contact: Contact) => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (contact.phone || "").includes(searchQuery) ||
                          (contact.email || "").toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFolder = selectedFolderId === "all" ? true : contact.folder_id === selectedFolderId
    return matchesSearch && matchesFolder
  })
  const selectedFolderData = selectedFolderId !== "all" ? folders.find(f => f.id === selectedFolderId) : null
  let content
  if (isLoading) {
    if (viewMode === "cards") {
      content = (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-in fade-in duration-300">
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
              <div className="h-5 w-32 bg-zinc-300 dark:bg-zinc-700 rounded mt-4" />
              <div className="h-12 bg-zinc-300/60 dark:bg-zinc-700/60 rounded-2xl w-full mt-6" />
            </div>
          ))}
        </div>
      )
    } else {
      content = (
        <div className="bg-transparent overflow-hidden relative z-10 w-full max-w-full animate-in fade-in duration-300">
          <div className="overflow-x-auto w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full text-left border-separate border-spacing-y-3 min-w-[600px]">
              <thead>
                <tr className="text-xs font-black uppercase text-muted-foreground tracking-wider h-12 bg-transparent select-none">
                  <th className="pl-6 py-3 w-1/3">{t("contacts.contactProfileTh")}</th>
                  <th className="py-3 w-1/4">{t("contacts.detailsTh")}</th>
                  <th className="py-3 w-32 text-center">{t("contacts.groupTh")}</th>
                  <th className="py-3 text-center">{t("contacts.financialStatusTh")}</th>
                  <th className="pr-6 py-3 text-right w-16">{t("folders.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="relative h-16 animate-pulse select-none">
                    <td className="pl-6 py-3.5 bg-zinc-200/50 dark:bg-zinc-800/30 rounded-l-2xl border-l border-y border-border/40 relative overflow-hidden">
                      <div className="absolute inset-0 animate-shimmer" />
                      <div className="flex items-center space-x-3.5 relative z-10">
                        <div className="h-10 w-10 rounded-full bg-zinc-300 dark:bg-zinc-700 shrink-0" />
                        <div className="flex flex-col space-y-2">
                          <div className="h-4 w-24 bg-zinc-300 dark:bg-zinc-700 rounded" />
                          <div className="h-3 w-16 bg-zinc-300 dark:bg-zinc-700 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 bg-zinc-200/50 dark:bg-zinc-800/30 border-y border-border/40 relative overflow-hidden">
                      <div className="absolute inset-0 animate-shimmer" />
                      <div className="flex flex-col space-y-2 relative z-10">
                        <div className="h-3 w-28 bg-zinc-300 dark:bg-zinc-700 rounded" />
                        <div className="h-3 w-20 bg-zinc-300 dark:bg-zinc-700 rounded" />
                      </div>
                    </td>
                    <td className="py-3.5 bg-zinc-200/50 dark:bg-zinc-800/30 border-y border-border/40 text-center relative overflow-hidden">
                      <div className="absolute inset-0 animate-shimmer" />
                      <div className="h-5 w-16 bg-zinc-300 dark:bg-zinc-700 rounded mx-auto relative z-10" />
                    </td>
                    <td className="py-3.5 bg-zinc-200/50 dark:bg-zinc-800/30 border-y border-border/40 text-center relative overflow-hidden">
                      <div className="absolute inset-0 animate-shimmer" />
                      <div className="h-5 w-24 bg-zinc-300 dark:bg-zinc-700 rounded mx-auto relative z-10" />
                    </td>
                    <td className="pr-6 py-3.5 bg-zinc-200/50 dark:bg-zinc-800/30 rounded-r-2xl border-r border-y border-border/40 text-right relative overflow-hidden">
                      <div className="absolute inset-0 animate-shimmer" />
                      <div className="flex items-center justify-end space-x-1 relative z-10">
                        <div className="h-8 w-8 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
                        <div className="h-8 w-8 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    }
  } else if (filteredContacts.length > 0) {
    if (viewMode === "cards") {
      content = (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-in fade-in duration-300">
          {filteredContacts.map((contact: Contact) => {
            const folder = contact.folder_id ? folders.find(f => f.id === contact.folder_id) : null
            const folderColor = folder?.color || "#64748b"
            const contactDebts = debts.filter(d => d.contact_id === contact.id)
            const debtCount = contactDebts.length
            let totalVal = 0
            let totalOwedToMe = 0
            let totalIOwe = 0
            contactDebts.forEach(debt => {
              const debtAmount = Number(debt.amount) || 0
              const paidAmount = Number(paymentsMap[debt.id]) || 0
              const remaining = Math.max(debtAmount - paidAmount, 0)
              if (debt.status !== "paid") {
                if (debt.direction === "they_owe_me") {
                  totalOwedToMe += remaining
                } else {
                  totalIOwe += remaining
                }
              }
              totalVal += debtAmount
            })
            const initials = contact.name.split(" ").map(n => n.charAt(0)).join("").toUpperCase().slice(0, 2)
            return (
              <Link
                to={`/debts?contact_id=${contact.id}`}
                key={contact.id}
                style={{
                  boxShadow: `0 10px 30px -10px ${folderColor}25`,
                }}
                className="group border border-border/60 bg-background/55 backdrop-blur-md rounded-[32px] p-6 text-left relative flex flex-col justify-between hover:border-indigo-500/30 hover:scale-[1.01] transition-all duration-300 shadow-sm cursor-pointer"
              >
                <div className="flex items-start justify-between relative w-full">
                  <div className="flex items-start space-x-3.5 min-w-0 flex-1">
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
                    <div className="flex flex-col text-left min-w-0 flex-1">
                      <h3 className="text-xl font-black text-foreground tracking-tight truncate leading-tight">
                        {contact.name}
                      </h3>
                      <span className="text-xs text-muted-foreground font-semibold mt-1 block truncate">
                        {folder ? `${t("contacts.groupMeta")}${folder.name}` : t("contacts.noGroup")} • {debtCount} {debtCount === 1 ? t("folders.debtSingle") : t("folders.debtPlural")}
                      </span>
                      {(contact.phone || contact.email) && (
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5 text-xs text-muted-foreground font-semibold">
                          {contact.phone && (
                            <div className="flex items-center gap-1.5 truncate">
                              <Phone className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                              <span>{contact.phone}</span>
                            </div>
                          )}
                          {contact.email && (
                            <div className="flex items-center gap-1.5 truncate">
                              <Mail className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                              <span>{contact.email}</span>
                            </div>
                          )}
                        </div>
                      )}
                      {contact.note && (
                        <p className="text-[10px] text-muted-foreground/80 italic mt-1 line-clamp-1 border-l border-border/80 pl-2">
                          “{contact.note}”
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="relative shrink-0 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setActiveMenuId(activeMenuId === contact.id ? null : contact.id)
                      }}
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                    {activeMenuId === contact.id && (
                      <div className="absolute right-0 top-9 bg-popover/95 backdrop-blur-md text-popover-foreground border border-border/50 rounded-xl shadow-xl py-1.5 w-32 z-30 animate-in fade-in-50 slide-in-from-top-1">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setEditingContact(contact)
                          }}
                          className="w-full px-3 py-2 text-left text-xs font-semibold hover:bg-muted flex items-center gap-2"
                        >
                          <EditIcon className="h-3.5 w-3.5 text-blue-500" />
                          {t("dashboard.editRecordBtn")}
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setDeleteId(contact.id)
                          }}
                          className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-500 hover:bg-rose-500/10 flex items-center gap-2"
                        >
                          <TrashIcon className="h-3.5 w-3.5" />
                          {t("dashboard.deleteBtn")}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-6 w-full">
                  <div className="bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/15 text-blue-500 rounded-2xl p-2.5 flex flex-col items-center justify-center">
                    <span className="text-[9px] uppercase font-black tracking-wider text-muted-foreground">{t("folders.total")}</span>
                    <span className="text-xs sm:text-sm font-black mt-1">${totalVal}</span>
                  </div>
                  <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/15 text-emerald-500 rounded-2xl p-2.5 flex flex-col items-center justify-center">
                    <span className="text-[9px] uppercase font-black tracking-wider text-muted-foreground">{t("folders.owes")}</span>
                    <span className="text-xs sm:text-sm font-black mt-1">${totalOwedToMe}</span>
                  </div>
                  <div className="bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/15 text-rose-500 rounded-2xl p-2.5 flex flex-col items-center justify-center">
                    <span className="text-[9px] uppercase font-black tracking-wider text-muted-foreground">{t("folders.iOwe")}</span>
                    <span className="text-xs sm:text-sm font-black mt-1">${totalIOwe}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )
    } else {
      content = (
        <div className="bg-transparent overflow-hidden relative z-10 w-full max-w-full">
          <div className="overflow-x-auto w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full text-left border-separate border-spacing-y-3 min-w-[600px]">
              <thead>
                <tr className="text-xs font-black uppercase text-muted-foreground tracking-wider h-12 bg-transparent select-none">
                  <th className="pl-6 py-3 w-1/3">{t("contacts.contactProfileTh")}</th>
                  <th className="py-3 w-1/4">{t("contacts.detailsTh")}</th>
                  <th className="py-3 w-32 text-center">{t("contacts.groupTh")}</th>
                  <th className="py-3 text-center">{t("contacts.financialStatusTh")}</th>
                  <th className="pr-6 py-3 text-right w-16">{t("folders.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact: Contact) => {
                  const folder = contact.folder_id ? folders.find(f => f.id === contact.folder_id) : null
                  const folderColor = folder?.color || "#64748b"
                  const contactDebts = debts.filter(d => d.contact_id === contact.id)
                  let totalVal = 0
                  let totalOwedToMe = 0
                  let totalIOwe = 0
                  contactDebts.forEach(debt => {
                    const debtAmount = Number(debt.amount) || 0
                    const paidAmount = Number(paymentsMap[debt.id]) || 0
                    const remaining = Math.max(debtAmount - paidAmount, 0)
                    if (debt.status !== "paid") {
                      if (debt.direction === "they_owe_me") {
                        totalOwedToMe += remaining
                      } else {
                        totalIOwe += remaining
                      }
                    }
                    totalVal += debtAmount
                  })
                  const initials = contact.name.split(" ").map(n => n.charAt(0)).join("").toUpperCase().slice(0, 2)
                  return (
                    <tr key={contact.id} className="group hover:scale-[1.005] transition-all h-16 text-sm font-semibold">
                      <td className="pl-6 py-3.5 bg-background/55 backdrop-blur-md rounded-l-2xl border-l border-y border-border/40 group-hover:bg-muted/10 transition-colors">
                        <div className="flex items-center space-x-3.5">
                          <div 
                            style={{ backgroundColor: `${folderColor}15`, color: folderColor, border: `1px solid ${folderColor}25` }}
                            className="h-10 w-10 rounded-full font-black text-xs flex items-center justify-center shrink-0"
                          >
                            {initials}
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="font-black text-foreground">{contact.name}</span>
                            {contact.note && (
                              <span className="text-[10px] text-muted-foreground italic mt-0.5 max-w-[150px] truncate">
                                “{contact.note}”
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 bg-background/55 backdrop-blur-md border-y border-border/40 group-hover:bg-muted/10 transition-colors text-muted-foreground">
                        <div className="flex flex-col space-y-1 text-[11px] font-bold">
                          {contact.phone && (
                            <span className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-indigo-500" /> {contact.phone}</span>
                          )}
                          {contact.email && (
                            <span className="flex items-center gap-1.5"><Mail className="h-3 w-3 text-indigo-500" /> {contact.email}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 bg-background/55 backdrop-blur-md border-y border-border/40 group-hover:bg-muted/10 transition-colors text-center">
                        {folder ? (
                          <span 
                            style={{ color: folderColor, backgroundColor: `${folderColor}12`, borderColor: `${folderColor}25` }}
                            className="text-[9px] border px-2 py-0.5 rounded-md font-extrabold uppercase tracking-wider"
                          >
                            {folder.name}
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground/60 font-bold">—</span>
                        )}
                      </td>
                      <td className="py-3.5 bg-background/55 backdrop-blur-md border-y border-border/40 group-hover:bg-muted/10 transition-colors text-center">
                        <div className="flex items-center justify-center space-x-1.5 text-[10px] font-black uppercase tracking-wide">
                          {totalOwedToMe > 0 && (
                            <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 px-2 py-0.5 rounded-md">
                              {t("contacts.owesLabel")} ${totalOwedToMe}
                            </span>
                          )}
                          {totalIOwe > 0 && (
                            <span className="bg-rose-500/10 text-rose-500 border border-rose-500/25 px-2 py-0.5 rounded-md">
                              {t("contacts.iOweLabel")} ${totalIOwe}
                            </span>
                          )}
                          {totalOwedToMe === 0 && totalIOwe === 0 && (
                            <span className="text-[9px] text-muted-foreground/50 font-bold">—</span>
                          )}
                        </div>
                      </td>
                      <td className="pr-6 py-3.5 bg-background/55 backdrop-blur-md rounded-r-2xl border-r border-y border-border/40 group-hover:bg-muted/10 transition-colors text-right relative">
                        <div className="flex items-center justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setEditingContact(contact)
                            }}
                            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10"
                          >
                            <EditIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setDeleteId(contact.id)
                            }}
                            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
                          >
                            <TrashIcon className="h-4 w-4" />
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
    }
  } else {
    content = (
      <div className="col-span-full border border-border/60 bg-background/55 backdrop-blur-md rounded-[32px] p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-5 shadow-sm min-h-[350px]">
        <div className="h-16 w-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center shadow-inner">
          <UserMinusIcon className="h-7 w-7" />
        </div>
        <div className="space-y-1.5 max-w-sm">
          <h4 className="text-base sm:text-lg font-black text-foreground tracking-tight">{t("contacts.noContactsTitle")}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t("contacts.noContactsDesc")}
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="rounded-full bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] hover:scale-[1.03] transition-all duration-300 font-bold text-xs px-8 py-5 shadow-lg shadow-indigo-500/25 border-0 mt-2 text-white"
        >
          {t("contacts.addFirstContactBtn")}
        </Button>
      </div>
    )
  }
  return (
    <>
      <div className="w-full flex flex-col space-y-6 sm:space-y-8 animate-in fade-in duration-500 relative max-w-7xl mx-auto px-4 sm:px-6 pb-36 lg:pb-24 select-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
              {t("header.contacts")} 
              <Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />
            </h1>
            <p className="text-xs text-muted-foreground mt-1">{t("contacts.contactsSubtitle")}</p>
          </div>
          <div className="flex items-center space-x-3.5">
            <div className="flex items-center bg-zinc-200/50 dark:bg-zinc-800/40 p-1 rounded-xl border border-border/60">
              <button
                onClick={() => setViewMode("cards")}
                className={`p-1.5 rounded-lg transition-all ${viewMode === "cards" ? "bg-background text-indigo-500 shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                title={t("folders.cardsView")}
              >
                <CardViewIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-all ${viewMode === "table" ? "bg-background text-indigo-500 shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
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
              {t("contacts.addContactBtn")}
            </Button>
          </div>
        </div>
        <div className="w-full relative overflow-hidden border border-zinc-200/40 dark:border-zinc-800/40 bg-white/30 dark:bg-zinc-950/20 backdrop-blur-xl rounded-[24px] p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-indigo-500/[0.02]">
          <div className="absolute -top-12 -left-12 h-24 w-24 rounded-full bg-indigo-500/10 blur-xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 h-24 w-24 rounded-full bg-pink-500/10 blur-xl pointer-events-none" />
          <div className="relative w-full sm:w-85 group z-10">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder={t("contacts.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10.5 w-full pl-10 pr-4 rounded-xl border border-border bg-background/30 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-muted-foreground/60"
            />
          </div>
          <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end z-10">
            <Button
              variant="outline"
              onClick={() => setIsFolderPickerOpen(true)}
              style={{
                borderColor: selectedFolderData ? `${selectedFolderData.color}35` : undefined,
                backgroundColor: selectedFolderData ? `${selectedFolderData.color}08` : undefined,
              }}
              className="rounded-xl border-border bg-background/20 text-xs font-bold px-4 py-5 flex items-center gap-2 hover:bg-muted/40 transition-all shrink-0 w-full sm:w-auto"
            >
              <Filter className="h-4 w-4 text-indigo-500 shrink-0" />
              <span className="truncate max-w-[130px]">
                {t("contacts.groupLabel")}{selectedFolderData ? selectedFolderData.name : t("contacts.allFolders")}
              </span>
              {selectedFolderData && (
                <span 
                  style={{ 
                    backgroundColor: selectedFolderData.color, 
                    boxShadow: `0 0 8px ${selectedFolderData.color}` 
                  }}
                  className="h-1.5 w-1.5 rounded-full shrink-0 animate-pulse ml-1"
                />
              )}
            </Button>
            {selectedFolderId !== "all" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedFolderId("all")}
                className="h-10 w-10 rounded-xl border border-border bg-background/15 text-muted-foreground hover:text-foreground shrink-0"
                aria-label={t("contacts.clearFilter")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        {content}
      </div>
      <AddContactModal 
        isOpen={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
        onSuccess={(msg) => showToast(msg)}
      />
      <EditContactModal 
        contact={editingContact} 
        onOpenChange={(open) => !open && setEditingContact(null)} 
        onSuccess={(msg) => showToast(msg)}
      />
      <DeleteContactModal 
        contactId={deleteId} 
        onOpenChange={(open) => !open && setDeleteId(null)} 
        onSuccess={(msg) => showToast(msg)}
      />
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] border border-white/20 px-5 py-3.5 shadow-2xl flex items-center gap-3 rounded-2xl animate-in slide-in-from-top-5 duration-300">
          <span className="h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-pulse" />
          <span className="text-xs font-bold text-white tracking-wide">{toast}</span>
        </div>
      )}
      <Dialog open={isFolderPickerOpen} onOpenChange={setIsFolderPickerOpen}>
        <DialogContent className="rounded-3xl border border-border bg-background/95 backdrop-blur-xl max-w-sm p-6 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-foreground flex items-center gap-2">
              <LayersIcon className="h-4.5 w-4.5 text-indigo-500" />
              {t("contacts.selectGroupTitle")}
            </DialogTitle>
          </DialogHeader>
          <div className="relative group mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder={t("contacts.searchFoldersPlaceholder")}
              value={folderSearchQuery}
              onChange={(e) => setFolderSearchQuery(e.target.value)}
              className="h-9.5 w-full pl-9 pr-4 rounded-xl border border-border bg-background/30 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-muted-foreground/60"
            />
          </div>
          <div className="flex flex-col space-y-1.5 max-h-[280px] overflow-y-auto pr-1 mt-3 scrollbar-thin scrollbar-thumb-border">
            <button
              onClick={() => {
                setSelectedFolderId("all")
                setIsFolderPickerOpen(false)
                setFolderSearchQuery("")
              }}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all text-left text-xs font-bold ${
                selectedFolderId === "all" 
                  ? "border-indigo-500/30 bg-indigo-500/5 text-indigo-500" 
                  : "border-border/40 hover:bg-muted/40 text-muted-foreground"
              }`}
            >
              <span>{t("contacts.allFolders")}</span>
              <span className="text-[9px] bg-muted/60 px-2 py-0.5 rounded font-black">{contacts.length}</span>
            </button>
            {filteredFoldersForPicker.map(f => {
              const count = getContactCountInFolder(f.id)
              const isSelected = selectedFolderId === f.id
              return (
                <button
                  key={f.id}
                  onClick={() => {
                    setSelectedFolderId(f.id)
                    setIsFolderPickerOpen(false)
                    setFolderSearchQuery("")
                  }}
                  style={{
                    borderColor: isSelected ? `${f.color}40` : undefined,
                    backgroundColor: isSelected ? `${f.color}08` : undefined,
                    color: isSelected ? f.color : undefined,
                  }}
                  className="flex items-center justify-between p-3 rounded-xl border border-border/40 hover:bg-muted/30 transition-all text-left text-xs font-bold"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span 
                      style={{ 
                        backgroundColor: f.color, 
                        boxShadow: `0 0 6px ${f.color}60` 
                      }}
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                    />
                    <span className="truncate">{f.name}</span>
                  </div>
                  <span className="text-[9px] bg-muted/50 px-2 py-0.5 rounded font-black text-muted-foreground">{count}</span>
                </button>
              )
            })}
            {filteredFoldersForPicker.length === 0 && (
              <div className="text-center text-[10px] text-muted-foreground py-6">
                {t("contacts.noGroupsFound")}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}