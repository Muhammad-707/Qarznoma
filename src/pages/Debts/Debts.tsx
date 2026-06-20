import * as React from "react"
import { useSearchParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Wallet, TrendingUp, TrendingDown, Plus, ArrowUpRight, ArrowDownLeft, Search, CheckCircle2, Trash2, Clock, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDebtsStore, type Debt } from "@/store/DebtsStore"
import { AddDebtModal } from "@/pages/Dashboard/AddDeptModal"
import EditDebtModal from "./EditDebtModal"
import DeleteDebtModal from "./DeleteDebtModal"
import AddPaymentModal from "./AddPaymentModal"
import DebtDetail from "./DebtDetail"
function Edit3Icon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}
export default function Debts() {
  const { t } = useTranslation()
  const {
    debts,
    summary,
    contacts,
    folders,
    paymentsMap,
    isLoading,
    fetchDebtsPageData,
    updateDebtStatus
  } = useDebtsStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const folderIdParam = searchParams.get("folder_id")
  const contactIdParam = searchParams.get("contact_id")
  const debtIdParam = searchParams.get("debt_id")
  const [activeDetailDebtId, setActiveDetailDebtId] = React.useState<string | null>(null)
  const [activeCard, setActiveTab] = React.useState<"net" | "owes" | "owe">("net")
  const [isFabOpen, setIsFabOpen] = React.useState(false)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [modalDirection, setModalDirection] = React.useState("they_owe_me")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filterDirection, setFilterDirection] = React.useState<string>("all")
  const [filterStatus, setFilterStatus] = React.useState<string>("all")
  const [editingDebt, setEditingDebt] = React.useState<Debt | null>(null)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [paymentDebtId, setPaymentDebtId] = React.useState<string | null>(null)
  const [toast, setToast] = React.useState<{ text: string; isError?: boolean } | null>(null)
  const [isFirstLoad, setIsFirstLoad] = React.useState(true)
  const hasStartedLoading = React.useRef(false)
  React.useEffect(() => {
    fetchDebtsPageData()
  }, [fetchDebtsPageData])
  React.useEffect(() => {
    if (isLoading) {
      hasStartedLoading.current = true
    } else if (hasStartedLoading.current || debts.length > 0 || summary) {
      setIsFirstLoad(false)
    }
  }, [isLoading, debts, summary])
  const showToast = (message: string, isError = false) => {
    setToast({ text: message, isError })
    setTimeout(() => setToast(null), 4000)
  }
  const formatDate = (isoString: string) => {
    if (!isoString) return ""
    const date = new Date(isoString)
    return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
  }
  const netTotalVal = summary?.outstanding?.net_balance !== undefined ? Number(summary.outstanding.net_balance) : 0
  const owesMeVal = summary?.outstanding?.they_owe_me !== undefined ? Number(summary.outstanding.they_owe_me) : 0
  const iOweVal = summary?.outstanding?.i_owe_them !== undefined ? Number(summary.outstanding.i_owe_them) : 0
  const openAddDebtModal = (dir: string) => {
    setModalDirection(dir)
    setIsModalOpen(true)
    setIsFabOpen(false)
  }
  const handleMarkAsPaid = async (id: string) => {
    try {
      await updateDebtStatus(id, "paid")
      showToast(t("debts.successMarkPaid"))
    } catch (err) {
      console.error(err)
    }
  }
  const filteredDebts = debts.filter((debt: Debt) => {
    const contact = contacts.find(c => c.id === debt.contact_id)
    const contactName = contact?.name || ""
    if (debtIdParam && debt.id !== debtIdParam) {
      return false
    }
    if (folderIdParam && contact?.folder_id !== folderIdParam) {
      return false
    }
    if (contactIdParam && debt.contact_id !== contactIdParam) {
      return false
    }
    if (activeCard === "owes" && debt.direction !== "they_owe_me") return false
    if (activeCard === "owe" && debt.direction !== "i_owe_them") return false
    const matchesSearch = contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (debt.description || "").toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDir = filterDirection === "all" ? true : debt.direction === filterDirection
    const matchesStatus = filterStatus === "all" ? true : debt.status === filterStatus
    return matchesSearch && matchesDir && matchesStatus
  })
  const activeFolderName = folderIdParam ? folders.find(f => f.id === folderIdParam)?.name : null
  const activeContactName = contactIdParam ? contacts.find(c => c.id === contactIdParam)?.name : null
  const activeDebtName = debtIdParam ? debts.find(d => d.id === debtIdParam)?.description : null
  if (activeDetailDebtId) {
    return (
      <div className="w-full flex flex-col space-y-6 sm:space-y-8 max-w-7xl mx-auto px-4 sm:px-6 pb-36 lg:pb-24 select-none animate-in fade-in duration-300">
        <DebtDetail
          debtId={activeDetailDebtId}
          onBack={() => {
            setActiveDetailDebtId(null)
            setSearchParams({})
          }}
          onSuccess={(msg) => showToast(msg, false)}
          onEdit={(debt) => setEditingDebt(debt)}
          onDelete={(id) => setDeleteId(id)}
          onPay={(id) => setPaymentDebtId(id)}
        />
        <EditDebtModal
          debt={editingDebt}
          onOpenChange={(open) => !open && setEditingDebt(null)}
          onSuccess={(msg) => showToast(msg, false)}
        />
        <DeleteDebtModal
          debtId={deleteId}
          onOpenChange={(open) => !open && setDeleteId(null)}
          onSuccess={(msg) => {
            showToast(msg)
            setActiveDetailDebtId(null)
          }}
        />
        <AddPaymentModal
          debtId={paymentDebtId}
          onOpenChange={(open) => !open && setPaymentDebtId(null)}
          onSuccess={(msg) => showToast(msg, false)}
          onError={(msg) => showToast(msg, true)}
        />
        {toast && (
          <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] border px-5 py-3.5 shadow-2xl flex items-center gap-3 rounded-2xl animate-in slide-in-from-top-5 duration-300
            ${toast.isError
              ? "bg-gradient-to-r from-red-600 to-rose-600 border-rose-500/30"
              : "bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] border-white/20"
            }`}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-pulse" />
            <span className="text-xs font-bold text-white tracking-wide">{toast.text}</span>
          </div>
        )}
      </div>
    )
  }
  return (
    <div className="w-full flex flex-col space-y-6 sm:space-y-8 animate-in fade-in duration-500 relative max-w-7xl mx-auto px-4 sm:px-6 pb-36 lg:pb-24 select-none">
      <style>{`
        @keyframes emptyVaultSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes skeletonShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-empty-spin {
          animation: emptyVaultSpin 28s infinite linear;
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
      {isLoading && !summary ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 select-none">
          <div className="col-span-2 md:col-span-1 relative p-6 md:p-8 h-32 md:h-48 rounded-[24px] md:rounded-[32px] border border-zinc-200/80 bg-zinc-200/50 dark:border-zinc-800/80 dark:bg-zinc-800/30 overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 animate-shimmer" />
          </div>
          <div className="col-span-1 relative p-4 md:p-8 h-32 md:h-48 rounded-[24px] md:rounded-[32px] border border-zinc-200/80 bg-zinc-200/50 dark:border-zinc-800/80 dark:bg-zinc-800/30 overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 animate-shimmer" />
          </div>
          <div className="col-span-1 relative p-4 md:p-8 h-32 md:h-48 rounded-[24px] md:rounded-[32px] border border-zinc-200/80 bg-zinc-200/50 dark:border-zinc-800/80 dark:bg-zinc-800/30 overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 animate-shimmer" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <button
            onClick={() => setActiveTab("net")}
            className={`col-span-2 md:col-span-1 w-full relative text-left p-6 md:p-8 h-32 md:h-48 rounded-[24px] md:rounded-[32px] text-white transition-all duration-500 ease-out group overflow-hidden cursor-pointer
              bg-gradient-to-br from-[#2563eb] via-[#3b82f6] to-[#6366f1]
              hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(37,99,235,0.45)]
              ${activeCard === "net" ? "ring-2 ring-white/50 ring-offset-2 dark:ring-offset-zinc-950 scale-[1.01]" : ""}`}
          >
            <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transition-all duration-1000 group-hover:left-[150%] pointer-events-none" />
            <div className="flex justify-between items-start mb-2 md:mb-4">
              <span className="text-[10px] md:text-xs font-black tracking-wider uppercase text-white/90">{t("section1.netTotal")}</span>
              <Wallet className="h-5 w-5 md:h-7 md:w-7 text-white/90 transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div className="text-3xl md:text-5xl font-black text-white tracking-tight mb-1 md:mb-2">${Math.abs(netTotalVal)}</div>
            <div className="text-[10px] md:text-[11px] text-white/70 font-bold">{t("dashboard.netTotalDesc")}</div>
          </button>
          <button
            onClick={() => setActiveTab("owes")}
            className={`col-span-1 w-full relative text-left p-4 md:p-8 h-32 md:h-48 rounded-[24px] md:rounded-[32px] text-white transition-all duration-500 ease-out group overflow-hidden cursor-pointer
              bg-gradient-to-br from-[#00b4d8] via-[#05c46b] to-[#0be881]
              hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-[0_25px_50px_rgba(5,196,107,0.45)]
              ${activeCard === "owes" ? "ring-2 ring-white/50 ring-offset-2 dark:ring-offset-zinc-950 scale-[1.01]" : ""}`}
          >
            <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transition-all duration-1000 group-hover:left-[150%] pointer-events-none" />
            <div className="flex justify-between items-start mb-2 md:mb-4">
              <span className="text-[10px] md:text-xs font-black tracking-wider uppercase text-white/95">{t("section1.owesMe")}</span>
              <TrendingUp className="h-5 w-5 md:h-7 md:w-7 text-white/95 transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div className="text-2xl md:text-5xl font-black text-white tracking-tight mb-1 md:mb-2">${owesMeVal}</div>
            <div className="text-[10px] md:text-[11px] text-white/70 font-bold">{t("dashboard.incoming")}</div>
          </button>
          <button
            onClick={() => setActiveTab("owe")}
            className={`col-span-1 w-full relative text-left p-4 md:p-8 h-32 md:h-48 rounded-[24px] md:rounded-[32px] text-white transition-all duration-500 ease-out group overflow-hidden cursor-pointer
              bg-gradient-to-br from-[#ff007f] via-[#f43f5e] to-[#e11d48]
              hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-[0_25px_50px_rgba(244,63,94,0.45)]
              ${activeCard === "owe" ? "ring-2 ring-white/50 ring-offset-2 dark:ring-offset-zinc-950 scale-[1.01]" : ""}`}
          >
            <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transition-all duration-1000 group-hover:left-[150%] pointer-events-none" />
            <div className="flex justify-between items-start mb-2 md:mb-4">
              <span className="text-[10px] md:text-xs font-black tracking-wider uppercase text-white/95">{t("section1.iOwe")}</span>
              <TrendingDown className="h-5 w-5 md:h-7 md:w-7 text-white/95 transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div className="text-2xl md:text-5xl font-black text-white tracking-tight mb-1 md:mb-2">${iOweVal}</div>
            <div className="text-[10px] md:text-[11px] text-white/70 font-bold">{t("dashboard.outgoing")}</div>
          </button>
        </div>
      )}
      <div className="w-full max-w-full border border-border/60 bg-background/60 backdrop-blur-md rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full sm:w-80 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder={t("debts.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full pl-10 pr-4 rounded-xl border border-border bg-background/50 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>
        <div className="flex items-center space-x-3 w-full max-w-full sm:w-auto justify-start sm:justify-end overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none min-w-0">
          <div className="flex items-center bg-muted/40 p-1 rounded-xl border border-border/60 text-xs font-bold shrink-0">
            <button
              onClick={() => setFilterDirection("all")}
              className={`px-3 py-1.5 rounded-lg transition-all ${filterDirection === "all" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              {t("debts.all")}
            </button>
            <button
              onClick={() => setFilterDirection("they_owe_me")}
              className={`px-3 py-1.5 rounded-lg transition-all ${filterDirection === "they_owe_me" ? "bg-emerald-500 text-white shadow-sm font-black" : "text-muted-foreground"}`}
            >
              {t("section1.owesMe")}
            </button>
            <button
              onClick={() => setFilterDirection("i_owe_them")}
              className={`px-3 py-1.5 rounded-lg transition-all ${filterDirection === "i_owe_them" ? "bg-rose-500 text-white shadow-sm font-black" : "text-muted-foreground"}`}
            >
              {t("section1.iOwe")}
            </button>
          </div>
          <div className="flex items-center bg-muted/40 p-1 rounded-xl border border-border/60 text-xs font-bold shrink-0">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1.5 rounded-lg transition-all ${filterStatus === "all" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              {t("debts.statusAll")}
            </button>
            <button
              onClick={() => setFilterStatus("pending")}
              className={`px-3 py-1.5 rounded-lg transition-all ${filterStatus === "pending" ? "bg-amber-500 text-white shadow-sm" : "text-muted-foreground"}`}
            >
              {t("dashboard.statusPending")}
            </button>
            <button
              onClick={() => setFilterStatus("paid")}
              className={`px-3 py-1.5 rounded-lg transition-all ${filterStatus === "paid" ? "bg-emerald-500 text-white shadow-sm" : "text-muted-foreground"}`}
            >
              {t("dashboard.statusPaid")}
            </button>
          </div>
        </div>
      </div>
      {(folderIdParam || contactIdParam || debtIdParam) && (
        <div className="flex flex-wrap gap-2.5 self-start animate-in fade-in duration-200">
          {folderIdParam && (
            <div className="flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/25 text-indigo-500 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm">
              <span>{t("debts.folderLabel")}{activeFolderName || "Loading..."}</span>
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams)
                  params.delete("folder_id")
                  setSearchParams(params)
                }}
                className="hover:text-indigo-700 ml-1.5 font-black text-sm"
              >
                ✕
              </button>
            </div>
          )}
          {contactIdParam && (
            <div className="flex items-center space-x-2 bg-purple-500/10 border border-purple-500/25 text-purple-500 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm">
              <span>{t("debts.contactLabel")}{activeContactName || "Loading..."}</span>
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams)
                  params.delete("contact_id")
                  setSearchParams(params)
                }}
                className="hover:text-purple-700 ml-1.5 font-black text-sm"
              >
                ✕
              </button>
            </div>
          )}
          {debtIdParam && (
            <div className="flex items-center space-x-2 bg-pink-500/10 border border-pink-500/25 text-pink-500 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm">
              <span>{t("debts.debtLabel")}{activeDebtName || "Loading..."}</span>
              <button
                onClick={() => {
                  setSearchParams({})
                }}
                className="hover:text-pink-700 ml-1.5 font-black text-sm"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}
      <div className="flex flex-col space-y-3.5 w-full max-w-full">
        {isLoading && isFirstLoad ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="relative border border-zinc-200/80 bg-zinc-200/50 dark:border-zinc-800/80 dark:bg-zinc-800/30 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-hidden shadow-sm">
              <div className="absolute inset-0 animate-shimmer" />
              <div className="flex items-center space-x-3.5">
                <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-zinc-300 dark:bg-zinc-700 shrink-0" />
                <div className="flex flex-col space-y-2 text-left">
                  <div className="h-4.5 w-28 bg-zinc-300 dark:bg-zinc-700 rounded" />
                  <div className="h-3 w-40 bg-zinc-300 dark:bg-zinc-700 rounded" />
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end space-x-3 sm:space-x-4 border-t md:border-0 pt-3 md:pt-0 border-border/40 w-full md:w-auto">
                <div className="flex flex-col items-start space-y-1.5 w-24 sm:w-32 hidden sm:flex">
                  <div className="h-2 w-16 bg-zinc-300 dark:bg-zinc-700 rounded" />
                  <div className="h-1.5 w-full bg-zinc-300 dark:bg-zinc-700 rounded" />
                </div>
                <div className="h-8 w-24 sm:w-32 bg-zinc-300/80 dark:bg-zinc-700/80 rounded-xl" />
              </div>
            </div>
          ))
        ) : filteredDebts.length > 0 ? (
          filteredDebts.map((debt: Debt) => {
            const contact = contacts.find(c => c.id === debt.contact_id)
            const contactName = contact?.name || t("debts.unknownContact")
            const folderName = contact?.folder_id ? folders.find(f => f.id === contact.folder_id)?.name : undefined
            const isOwesMe = debt.direction === "they_owe_me"
            const isPaid = debt.status === "paid"
            const debtAmount = Number(debt.amount) || 0
            const paidAmount = Number(paymentsMap[debt.id]) || 0
            const remainingAmount = Math.max(debtAmount - paidAmount, 0)
            const progressPercent = isPaid ? 100 : Math.min(Math.round((paidAmount / debtAmount) * 100), 100)
            return (
              <div
                key={debt.id}
                className="w-full max-w-full border border-border/60 bg-background/60 backdrop-blur-md rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-500/30 hover:scale-[1.005] transition-all shadow-sm animate-in fade-in-50 duration-200"
              >
                <div
                  onClick={() => setActiveDetailDebtId(debt.id)}
                  className="flex items-center space-x-3.5 w-full md:w-auto cursor-pointer group/name"
                >
                  {isOwesMe ? (
                    <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                      <ArrowDownLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                  ) : (
                    <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-500 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.2)]">
                      <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                  )}
                  <div className="flex flex-col text-left min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-black text-foreground group-hover/name:text-indigo-500 transition-colors truncate">{contactName}</span>
                      {folderName && (
                        <span className="text-[10px] bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 px-2 py-0.5 rounded-md font-bold shrink-0">
                          {folderName}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] sm:text-xs text-muted-foreground font-medium mt-1 truncate max-w-[180px] sm:max-w-xs">
                      {debt.description || t("debts.noDescription")} • <Clock className="inline h-3 w-3 mb-0.5" /> {formatDate(debt.due_date)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end space-x-3 sm:space-x-4 border-t md:border-0 pt-3 md:pt-0 border-border/40 w-full md:w-auto">
                  <div className="flex flex-col items-start space-y-1.5 w-24 sm:w-32 hidden sm:flex">
                    <span className="text-[9px] font-black text-muted-foreground uppercase">{t("dashboard.returnProgress", { progress: progressPercent })}</span>
                    <div className="w-full h-1.5 bg-muted/60 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${progressPercent}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${isPaid ? "bg-emerald-500" : "bg-blue-500"}`}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col text-right shrink-0">
                    <span className={`text-base sm:text-xl font-black ${isOwesMe ? "text-emerald-500" : "text-rose-500"}`}>
                      {isOwesMe ? "+" : "-"}${isPaid ? 0 : remainingAmount}
                    </span>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded self-end mt-1 ${isPaid ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500"
                      }`}>
                      {isPaid ? t("dashboard.statusPaid") : t("dashboard.statusPending")}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 bg-muted/30 p-1 rounded-xl border border-border/50 shrink-0">
                    {!isPaid && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPaymentDebtId(debt.id)}
                        className="h-8 w-8 sm:w-auto rounded-lg text-[11px] sm:text-xs font-bold text-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-600 gap-1 p-0 sm:px-2.5"
                      >
                        <Coins className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">{t("debts.payBtn")}</span>
                      </Button>
                    )}
                    {!isPaid && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsPaid(debt.id)}
                        className="h-8 w-8 sm:w-auto rounded-lg text-[11px] sm:text-xs font-bold text-emerald-500 hover:bg-emerald-500/10 gap-1 p-0 sm:px-2.5"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">{t("dashboard.statusPaid")}</span>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingDebt(debt)}
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-indigo-500 hover:bg-indigo-500/10"
                    >
                      <Edit3Icon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(debt.id)}
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="border border-border/60 bg-background/55 backdrop-blur-md rounded-[32px] p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-5 shadow-sm min-h-[320px]">
            <svg viewBox="0 0 120 120" className="h-20 w-20 sm:h-24 sm:w-24 text-indigo-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.65)] overflow-visible">
              <circle cx="60" cy="60" r="48" stroke="url(#empty-gradient-glow-debts-final-responsive)" strokeWidth="1.8" strokeDasharray="6 4" fill="none" className="animate-empty-spin" />
              <circle cx="60" cy="60" r="36" stroke="currentColor" strokeWidth="2.2" fill="none" className="opacity-80" />
              <circle cx="60" cy="12" r="3" fill="#22d3ee" className="animate-pulse shadow-md" />
              <circle cx="60" cy="108" r="3" fill="#ec4899" className="animate-pulse shadow-md" />
              <g transform="translate(43, 43)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-indigo-400">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </g>
              <defs>
                <linearGradient id="empty-gradient-glow-debts-final-responsive" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
            <div className="space-y-1.5 max-w-sm">
              <h4 className="text-base sm:text-lg font-black text-foreground tracking-tight">{t("debts.noDebtsFound")}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("debts.noDebtsDesc")}
              </p>
            </div>
            <Button
              onClick={() => openAddDebtModal("they_owe_me")}
              className="rounded-full bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] hover:scale-[1.03] transition-all duration-300 font-bold text-white text-xs px-8 py-5 shadow-lg shadow-indigo-500/25 border-0 mt-2"
            >
              {t("debts.createNewDebtBtn")}
            </Button>
          </div>
        )}
      </div>
      <div
        onMouseEnter={() => setIsFabOpen(true)}
        onMouseLeave={() => setIsFabOpen(false)}
        className="fixed bottom-24 right-6 lg:bottom-8 lg:right-8 flex flex-col items-end space-y-3 z-40 transition-all duration-300"
      >
        <div className={`flex flex-col items-end space-y-2.5 transition-all duration-300 origin-bottom ${isFabOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-75 translate-y-4 pointer-events-none"}`}>
          <button
            onClick={() => openAddDebtModal("i_owe_them")}
            className="flex items-center space-x-2 bg-background border border-border/80 px-3.5 py-2 rounded-full shadow-xl active:scale-95 transition-transform"
          >
            <span className="text-xs font-bold text-foreground">{t("section1.iOwe")}</span>
            <div className="h-7 w-7 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-sm">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </button>
          <button
            onClick={() => openAddDebtModal("they_owe_me")}
            className="flex items-center space-x-2 bg-background border border-border/80 px-3.5 py-2 rounded-full shadow-xl active:scale-95 transition-transform"
          >
            <span className="text-xs font-bold text-foreground">{t("section1.owesMe")}</span>
            <div className="h-7 w-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
              <ArrowDownLeft className="h-4 w-4" />
            </div>
          </button>
        </div>
        <button
          onClick={() => setIsFabOpen(!isFabOpen)}
          className="h-14 w-14 rounded-full flex items-center justify-center text-white bg-gradient-to-r from-blue-500 to-purple-600 border-0 shadow-xl active:scale-95 hover:scale-105 transition-all"
        >
          <Plus className={`h-7 w-7 transition-all duration-300 ${isFabOpen ? "rotate-45" : "rotate-0"}`} />
        </button>
      </div>
      <AddDebtModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        defaultDirection={modalDirection}
        onSuccess={(msg) => showToast(msg)}
      />
      <EditDebtModal
        debt={editingDebt}
        onOpenChange={(open) => !open && setEditingDebt(null)}
        onSuccess={(msg) => showToast(msg)}
      />
      <DeleteDebtModal
        debtId={deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onSuccess={(msg) => showToast(msg)}
      />
      <AddPaymentModal
        debtId={paymentDebtId}
        onOpenChange={(open) => !open && setPaymentDebtId(null)}
        onSuccess={(msg) => showToast(msg, false)}
        onError={(msg) => showToast(msg, true)}
      />
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] border px-5 py-3.5 shadow-2xl flex items-center gap-3 rounded-2xl animate-in slide-in-from-top-5 duration-300
          ${toast.isError
            ? "bg-gradient-to-r from-red-600 to-rose-600 border-rose-500/30"
            : "bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] border-white/20"
          }`}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-pulse" />
          <span className="text-xs font-bold text-white tracking-wide">{toast.text}</span>
        </div>
      )}
    </div>
  )
}