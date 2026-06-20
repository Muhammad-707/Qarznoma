import * as React from "react"
import { useTranslation } from "react-i18next"
import { UserMinus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUsersStore } from "@/store/UsersStore"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
interface DeleteUserModalProps {
  userId: string | null
  onOpenChange: (open: boolean) => void
  onSuccess: (message: string) => void
}
export default function DeleteUserModal({ userId, onOpenChange, onSuccess }: DeleteUserModalProps) {
  const { t } = useTranslation()
  const { deleteUser } = useUsersStore()
  const handleDeleteConfirm = async () => {
    if (!userId) return
    onOpenChange(false)
    try {
      await deleteUser(userId)
      onSuccess(t("users.successDeleteUser"))
    } catch {
      onSuccess(t("users.errorDeleteUser"))
    }
  }
  return (
    <Dialog open={userId !== null} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border border-border bg-background max-w-sm p-6 shadow-2xl z-50 animate-in fade-in duration-200">
        <DialogHeader>
          <DialogTitle className="text-base font-black text-foreground flex items-center gap-2">
            <UserMinus className="h-4.5 w-4.5 text-rose-500 animate-pulse" />
            {t("users.deleteUserTitle")}
          </DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground leading-relaxed mt-2 text-left">
          {t("users.deleteConfirm")}
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