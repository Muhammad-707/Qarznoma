import * as React from "react"
import { useTranslation } from "react-i18next"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDebtsStore } from "@/store/DebtsStore"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
interface DeleteDebtModalProps {
  debtId: string | null
  onOpenChange: (open: boolean) => void
  onSuccess: (message: string) => void
}
export default function DeleteDebtModal({ debtId, onOpenChange, onSuccess }: DeleteDebtModalProps) {
  const { t } = useTranslation()
  const { deleteDebt } = useDebtsStore()
  const handleDeleteConfirm = async () => {
    if (!debtId) return
    onOpenChange(false)
    try {
      await deleteDebt(debtId)
      onSuccess(t("dashboard.successDeleteDebt"))
    } catch {
      onSuccess(t("dashboard.errorDeleteDebt"))
    }
  }
  return (
    <Dialog open={debtId !== null} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border border-zinc-200/40 dark:border-zinc-800/40 bg-background max-w-sm p-6 shadow-2xl z-50 animate-in fade-in duration-200">
        <DialogHeader>
          <DialogTitle className="text-base font-black text-foreground flex items-center gap-2">
            <Trash2 className="h-4.5 w-4.5 text-rose-500 animate-pulse" />
            {t("dashboard.deleteDebtTitle")}
          </DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground leading-relaxed mt-2 text-left">
          {t("dashboard.deleteDebtConfirm")}
        </p>
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border/50 mt-4">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-full text-xs">
            {t("dashboard.cancelBtn")}
          </Button>
          <Button type="button" onClick={handleDeleteConfirm} className="rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-5 active:scale-95 transition-all">
            {t("dashboard.deleteBtn")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}