import * as React from "react"
import { useTranslation } from "react-i18next"
import { Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDebtsStore } from "@/store/DebtsStore"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
interface AddPaymentModalProps {
  debtId: string | null
  onOpenChange: (open: boolean) => void
  onSuccess: (message: string) => void
  onError: (message: string) => void
}
export default function AddPaymentModal({ debtId, onOpenChange, onSuccess, onError }: AddPaymentModalProps) {
  const { t } = useTranslation()
  const { addDebtPayment } = useDebtsStore()
  const [amount, setAmount] = React.useState("")
  const [note, setNote] = React.useState("")
  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!debtId || !amount) return
    const numAmount = Number(amount)
    if (numAmount <= 0) {
      onError(t("dashboard.errorPositiveAmount"))
      return
    }
    onOpenChange(false)
    setAmount("")
    setNote("")
    try {
      await addDebtPayment(debtId, numAmount, note || "Debt payment")
      onSuccess(t("dashboard.successPaid", { amount: numAmount }))
    } catch {
      onError(t("dashboard.errorRegisterPayment"))
    }
  }
  return (
    <Dialog open={debtId !== null} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border border-zinc-200/40 dark:border-zinc-800/40 bg-background max-w-sm p-6 shadow-2xl z-50">
        <DialogHeader>
          <DialogTitle className="text-base font-black text-foreground flex items-center gap-2">
            <Coins className="h-4.5 w-4.5 text-indigo-500" />
            {t("dashboard.addPaymentTitle")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSavePayment} className="flex flex-col space-y-4 text-left mt-2">
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground ml-1">{t("dashboard.amountLabel")}</label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t("dashboard.enterPaidAmountPlaceholder")}
              className="h-10.5 w-full px-4 rounded-xl border border-border bg-background/50 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground ml-1">{t("dashboard.noteLabel")}</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t("dashboard.notePlaceholder")}
              className="h-10.5 w-full px-4 rounded-xl border border-border bg-background/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
            />
          </div>
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-border/50">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-full text-xs">
              {t("dashboard.cancelBtn")}
            </Button>
            <Button type="submit" className="rounded-full bg-indigo-600 text-white text-xs font-bold">
              {t("dashboard.savePaymentBtn")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}