import * as React from "react"
import { useTranslation } from "react-i18next"
import { UserMinus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useContactsStore } from "@/store/ContactsStore"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
interface DeleteContactModalProps {
  contactId: string | null
  onOpenChange: (open: boolean) => void
  onSuccess: (message: string) => void
}
export default function DeleteContactModal({ contactId, onOpenChange, onSuccess }: DeleteContactModalProps) {
  const { t } = useTranslation()
  const { deleteContact } = useContactsStore()
  const handleDeleteConfirm = async () => {
    if (!contactId) return
    onOpenChange(false)
    try {
      await deleteContact(contactId)
      onSuccess(t("contacts.successDelete"))
    } catch (err) {
      console.error(err)
      onSuccess(t("contacts.errorDelete"))
    }
  }
  return (
    <Dialog open={contactId !== null} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border border-zinc-200/40 dark:border-zinc-800/40 bg-background max-w-sm p-6 shadow-2xl z-50 animate-in fade-in duration-200">
        <DialogHeader>
          <DialogTitle className="text-base font-black text-foreground flex items-center gap-2">
            <UserMinus className="h-4.5 w-4.5 text-rose-500 animate-pulse" />
            {t("contacts.deleteContactTitle")}
          </DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground leading-relaxed mt-2 text-left">
          {t("contacts.deleteConfirm")}
        </p>
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border/50 mt-4">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-full text-xs font-bold">
            {t("folders.cancelBtn")}
          </Button>
          <Button type="button" onClick={handleDeleteConfirm} className="rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-5 active:scale-95 transition-all">
            {t("folders.deleteBtn")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}