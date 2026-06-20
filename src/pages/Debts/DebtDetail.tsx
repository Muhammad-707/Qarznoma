import * as React from "react"
import { useTranslation } from "react-i18next"
import { 
  ArrowLeft, 
  Coins, 
  Trash2, 
  Edit3, 
  Clock, 
  FileText,
  Sparkles,
  Phone,
  Mail,
  FolderOpen,
  ArrowUpRight,
  ArrowDownLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDebtsStore, type Debt } from "@/store/DebtsStore"
import { axiosRequest } from "@/store/AuthStore/LoginStore"
interface DebtDetailProps {
  debtId: string
  onBack: () => void
  onSuccess: (message: string) => void
  onEdit: (debt: Debt) => void
  onDelete: (id: string) => void
  onPay: (id: string) => void
}
interface PaymentItem {
  id: string
  amount: number
  note: string
  paid_at: string
}
function Edit3Icon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}
export default function DebtDetail({ debtId, onBack, onSuccess, onEdit, onDelete, onPay }: DebtDetailProps) {
  const { t } = useTranslation()
  const { debts, contacts, folders, paymentsMap } = useDebtsStore()
  const [payments, setPayments] = React.useState<PaymentItem[]>([])
  const [loadingHistory, setLoadingHistory] = React.useState(false)
  const debt = debts.find(d => d.id === debtId)
  const contact = debt ? contacts.find(c => c.id === debt.contact_id) : null
  const folder = contact?.folder_id ? folders.find(f => f.id === contact.folder_id) : null
  const fetchPaymentHistory = React.useCallback(async () => {
    if (!debtId) return
    setLoadingHistory(true)
    try {
      const res = await axiosRequest.get(`debts/${debtId}/payments`)
      const sorted = (res.data || []).sort(
        (a: any, b: any) => new Date(b.paid_at).getTime() - new Date(a.paid_at).getTime()
      )
      setPayments(sorted)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingHistory(false)
    }
  }, [debtId])
  React.useEffect(() => {
    fetchPaymentHistory()
  }, [fetchPaymentHistory, paymentsMap])
  if (!debt || !contact) {
    return (
      <div className="text-center py-12 select-none animate-in fade-in duration-300">
        <p className="text-sm text-muted-foreground">{t("dashboard.debtNotFound")}</p>
        <Button onClick={onBack} variant="link" className="mt-2">{t("dashboard.backToList")}</Button>
      </div>
    )
  }
  const folderColor = folder?.color || "#64748b"
  const initials = contact.name.split(" ").map(n => n.charAt(0)).join("").toUpperCase().slice(0, 2)
  const debtAmount = Number(debt.amount) || 0
  const totalPaid = Number(paymentsMap[debt.id]) || 0
  const remainingAmount = Math.max(debtAmount - totalPaid, 0)
  const progressPercent = debt.status === "paid" ? 100 : Math.min(Math.round((totalPaid / debtAmount) * 100), 100)
  const formatDate = (isoString: string) => {
    if (!isoString) return ""
    return new Date(isoString).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
  }
  const isOwesMe = debt.direction === "they_owe_me"
  const themeColor = isOwesMe ? "#10b981" : "#f43f5e"
  return (
    <div className="w-full flex flex-col space-y-6 sm:space-y-8 animate-in slide-in-from-left duration-300 select-none">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-black text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("dashboard.backToList")}
        </button>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => debt && onEdit(debt)}
            className="rounded-xl border-border bg-background/30 text-xs font-bold gap-1.5 h-9"
          >
            <Edit3Icon className="h-3.5 w-3.5 text-blue-500" />
            {t("dashboard.editRecordBtn")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(debt.id)}
            className="rounded-xl border-border bg-background/30 text-xs font-bold gap-1.5 h-9 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {t("dashboard.deleteBtn")}
          </Button>
        </div>
      </div>
      <div 
        style={{
          boxShadow: `0 10px 30px -10px ${folderColor}25`,
        }}
        className="group border border-border/60 bg-background/55 backdrop-blur-md rounded-[32px] p-6 text-left relative flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm overflow-hidden"
      >
        <div style={{ backgroundColor: `${themeColor}03` }} className="absolute inset-0 pointer-events-none" />
        <div className="flex items-center space-x-4 shrink-0">
          <div 
            style={{
              backgroundColor: `${folderColor}12`,
              border: `1.5px solid ${folderColor}25`,
              color: folderColor,
              boxShadow: `0 0 15px ${folderColor}15`
            }}
            className="h-14 w-14 rounded-full font-black text-lg flex items-center justify-center shrink-0"
          >
            {initials}
          </div>
          <div className="flex flex-col text-left">
            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2 leading-none">
              {contact.name}
              <Sparkles className="h-4.5 w-4.5 text-indigo-500 animate-pulse" />
            </h2>
            <div className="flex flex-wrap items-center gap-2.5 mt-2.5 text-xs text-muted-foreground font-semibold">
              <span className="flex items-center gap-1.5"><FolderOpen className="h-3.5 w-3.5 text-indigo-500" /> {folder ? folder.name : t("dashboard.noGroup")}</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-indigo-500" /> {t("dashboard.due")}{formatDate(debt.due_date).split(",")[0]}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2.5 w-full md:w-auto md:min-w-[340px] relative z-10 shrink-0 select-none">
          <div className="bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/15 text-blue-500 rounded-2xl p-3 flex flex-col items-center justify-center">
            <span className="text-[9px] uppercase font-black tracking-wider text-muted-foreground">{t("section1.netTotal")}</span>
            <span className="text-xs sm:text-sm font-black mt-1">${debtAmount}</span>
          </div>
          <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/15 text-emerald-500 rounded-2xl p-3 flex flex-col items-center justify-center">
            <span className="text-[9px] uppercase font-black tracking-wider text-muted-foreground">{t("dashboard.statusPaid")}</span>
            <span className="text-xs sm:text-sm font-black mt-1">${totalPaid}</span>
          </div>
          <div 
            style={{
              borderColor: `${folderColor}25`,
              backgroundColor: `${folderColor}05`
            }}
            className="border rounded-2xl p-3 flex flex-col items-center justify-center"
          >
            <span className="text-[9px] uppercase font-black tracking-wider text-muted-foreground">{t("dashboard.remaining")}</span>
            <span style={{ color: folderColor }} className="text-xs sm:text-sm font-black mt-1">
              ${debt.status === "paid" ? 0 : remainingAmount}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border border-border/50 bg-background/55 backdrop-blur-md rounded-[28px] p-5 shadow-sm text-left">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-black text-foreground flex items-center gap-2">
              <Coins className="h-4.5 w-4.5 text-indigo-500" />
              {t("dashboard.adjustBalanceFlow")}
            </h3>
            <Button
              onClick={() => onPay(debt.id)}
              className="rounded-full bg-gradient-to-tr from-[#2563eb] to-[#7c3aed] text-white hover:scale-[1.03] transition-all text-xs font-bold h-8 px-4"
            >
              <Coins className="h-3 w-3 mr-1.5" />
              {t("dashboard.addPaymentTitle")}
            </Button>
          </div>
          {loadingHistory ? (
            <div className="py-12 text-center animate-pulse text-xs text-muted-foreground">
              {t("dashboard.loadingHistory")}
            </div>
          ) : payments.length > 0 ? (
            <div className="overflow-x-auto w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-[10px] font-black uppercase text-muted-foreground select-none">
                    <th className="pl-4 py-2">{t("dashboard.transactionDate")}</th>
                    <th className="py-2">{t("dashboard.noteDescription")}</th>
                    <th className="pr-4 py-2 text-right">{t("dashboard.adjustment")}</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="text-xs font-semibold">
                      <td className="pl-4 py-3 bg-background/50 rounded-l-xl border-l border-y border-border/40">
                        {formatDate(p.paid_at)}
                      </td>
                      <td className="py-3 bg-background/50 border-y border-border/40 text-muted-foreground">
                        {p.note}
                      </td>
                      <td className={`pr-4 py-3 bg-background/50 rounded-r-xl border-r border-y border-border/40 text-right font-black ${
                        Number(p.amount) >= 0 ? "text-emerald-500" : "text-rose-500"
                      }`}>
                        {Number(p.amount) >= 0 ? `+$${p.amount}` : `-$${Math.abs(p.amount)}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-muted-foreground">
              {t("dashboard.noTransactions")}
            </div>
          )}
        </div>
        <div className="border border-border/50 bg-background/55 backdrop-blur-md rounded-[28px] p-5 shadow-sm text-left flex flex-col space-y-4">
          <h3 className="text-base font-black text-foreground flex items-center gap-2">
            <FileText className="h-4.5 w-4.5 text-indigo-500" />
            {t("dashboard.transactionMemo")}
          </h3>
          <div className="flex flex-col space-y-3 text-xs font-semibold">
            <div className="bg-muted/30 p-4 rounded-2xl border border-border/40">
              <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider block">{t("dashboard.returnProgress", { progress: progressPercent })}</span>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-2">
                <div style={{ width: `${progressPercent}%`, backgroundColor: folderColor }} className="h-full rounded-full transition-all" />
              </div>
              <span className="text-[9px] font-bold text-muted-foreground mt-2 uppercase tracking-wide block">
                {t("dashboard.status")}: {debt.status}
              </span>
            </div>
            <div className="bg-muted/30 p-3 rounded-2xl border border-border/40">
              <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider block">{t("dashboard.description")}</span>
              <p className="text-foreground mt-1 font-bold">{debt.description || t("dashboard.noDescriptionProvided")}</p>
            </div>
            <div className="bg-muted/30 p-3 rounded-2xl border border-border/40">
              <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider block">{t("dashboard.contactDetails")}</span>
              <div className="flex flex-col space-y-2 mt-2.5 text-xs text-muted-foreground font-bold">
                {contact.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                    <span>{contact.phone}</span>
                  </div>
                )}
                {contact.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                    <span>{contact.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}