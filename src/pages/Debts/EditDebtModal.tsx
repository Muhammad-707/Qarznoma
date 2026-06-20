import * as React from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useTranslation } from "react-i18next"
import { Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDebtsStore, type Debt } from "@/store/DebtsStore"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
interface EditDebtModalProps {
  debt: Debt | null
  onOpenChange: (open: boolean) => void
  onSuccess: (message: string) => void
}
export default function EditDebtModal({ debt, onOpenChange, onSuccess }: EditDebtModalProps) {
  const { t } = useTranslation()
  const { contacts, updateDebt } = useDebtsStore()
  const DebtValidationSchema = Yup.object().shape({
    contact_id: Yup.string().required(t("auth.firstNameRequired")),
    amount: Yup.number().positive(t("auth.passwordMin")).required(t("auth.passwordRequired")),
    description: Yup.string().max(100, t("auth.passwordsMustMatch")).required(t("auth.confirmPasswordRequired")),
    due_date: Yup.string().required(t("auth.confirmPasswordRequired")),
    status: Yup.string().oneOf(["pending", "partial", "paid"]).required(),
    direction: Yup.string().oneOf(["they_owe_me", "i_owe_them"]).required(),
  })
  const formik = useFormik({
    initialValues: { contact_id: "", amount: 0, description: "", due_date: "", status: "pending", direction: "they_owe_me" },
    enableReinitialize: true,
    validationSchema: DebtValidationSchema,
    onSubmit: async (values) => {
      if (!debt) return
      onOpenChange(false)
      try {
        await updateDebt(debt.id, {
          ...values,
          amount: Number(values.amount)
        })
        onSuccess(t("dashboard.successUpdate"))
      } catch {
        onSuccess(t("dashboard.errorDeleteDebt"))
      }
    }
  })
  React.useEffect(() => {
    if (debt) {
      formik.setValues({
        contact_id: debt.contact_id,
        amount: Number(debt.amount) || 0,
        description: debt.description || "",
        due_date: debt.due_date ? debt.due_date.split("T")[0] : "",
        status: debt.status || "pending",
        direction: debt.direction || "they_owe_me",
      })
    }
  }, [debt])
  return (
    <Dialog open={debt !== null} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border border-zinc-200/40 dark:border-zinc-800/40 bg-background max-w-md p-6 shadow-2xl z-50">
        <DialogHeader>
          <DialogTitle className="text-lg font-black text-foreground text-left flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-indigo-500" />
            {t("dashboard.editDebtTitle")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="flex flex-col space-y-4 text-left mt-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-muted-foreground ml-1">{t("dashboard.contactLabel")}</label>
              <select
                name="contact_id"
                onChange={formik.handleChange}
                value={formik.values.contact_id}
                className="h-10 w-full px-3 rounded-xl border border-border bg-background/50 text-xs font-semibold focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
              >
                {contacts.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-muted-foreground ml-1">{t("dashboard.amountLabel")}</label>
              <input
                name="amount"
                type="number"
                onChange={formik.handleChange}
                value={formik.values.amount}
                className="h-10 w-full px-4 rounded-xl border border-border bg-background/50 text-xs font-semibold focus:outline-none focus:ring-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-muted-foreground ml-1">{t("dashboard.directionLabel")}</label>
              <select
                name="direction"
                onChange={formik.handleChange}
                value={formik.values.direction}
                className="h-10 w-full px-3 rounded-xl border border-border bg-background/50 text-xs font-semibold focus:ring-2"
              >
                <option value="they_owe_me">{t("section1.owesMe")}</option>
                <option value="i_owe_them">{t("section1.iOwe")}</option>
              </select>
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-muted-foreground ml-1">{t("dashboard.statusLabel")}</label>
              <select
                name="status"
                onChange={formik.handleChange}
                value={formik.values.status}
                className="h-10 w-full px-3 rounded-xl border border-border bg-background/50 text-xs font-semibold focus:ring-2"
              >
                <option value="pending">{t("dashboard.statusPending")}</option>
                <option value="partial">{t("dashboard.statusPartial")}</option>
                <option value="paid">{t("dashboard.statusPaid")}</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-muted-foreground ml-1">{t("dashboard.dueDateLabel")}</label>
              <input
                name="due_date"
                type="date"
                onChange={formik.handleChange}
                value={formik.values.due_date}
                className="h-10 w-full px-4 rounded-xl border border-border bg-background/50 text-xs font-semibold focus:outline-none focus:ring-2"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-muted-foreground ml-1">{t("dashboard.descriptionLabel")}</label>
              <input
                name="description"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.description}
                placeholder={t("dashboard.editDescriptionPlaceholder")}
                className="h-10 w-full px-4 rounded-xl border border-border bg-background/50 text-xs font-semibold focus:outline-none focus:ring-2"
              />
            </div>
          </div>
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-border/50">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-full text-xs font-bold">
              {t("dashboard.cancelBtn")}
            </Button>
            <Button type="submit" className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-6">
              {t("dashboard.saveChangesBtn")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}