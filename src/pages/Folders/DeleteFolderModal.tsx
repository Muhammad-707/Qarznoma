import * as React from "react"
import { useTranslation } from "react-i18next"
import { FolderMinus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFoldersStore } from "@/store/FoldersStore"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
interface DeleteFolderModalProps {
  folderId: string | null
  onOpenChange: (open: boolean) => void
  onSuccess: (message: string) => void
}
export default function DeleteFolderModal({ folderId, onOpenChange, onSuccess }: DeleteFolderModalProps) {
  const { t } = useTranslation()
  const { deleteFolder } = useFoldersStore()
  const handleDeleteConfirm = async () => {
    if (!folderId) return
    onOpenChange(false)
    try {
      await deleteFolder(folderId)
      onSuccess(t("folders.successDelete"))
    } catch (err: any) {
      onSuccess(`Error: ${err.message}`)
    }
  }
  return (
    <Dialog open={folderId !== null} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-border bg-background max-w-sm p-6 shadow-2xl z-50">
        <DialogHeader>
          <DialogTitle className="text-base font-black text-foreground flex items-center gap-2">
            <FolderMinus className="h-4.5 w-4.5 text-rose-500 animate-pulse" />
            {t("folders.deleteFolderTitle")}
          </DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground leading-relaxed mt-2 text-left">
          {t("folders.deleteConfirm")}
        </p>
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border/50 mt-4">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-full text-xs font-bold">
            {t("folders.cancelBtn")}
          </Button>
          <Button type="button" onClick={handleDeleteConfirm} className="rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-5">
            {t("folders.deleteBtn")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}