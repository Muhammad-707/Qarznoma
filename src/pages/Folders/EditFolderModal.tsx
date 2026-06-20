import * as React from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { useFoldersStore, type Folder } from "@/store/FoldersStore"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
const PRESET_COLORS = ["#2563eb", "#ff007f", "#0be881", "#f43f5e", "#7c3aed", "#00b4d8"]
interface EditFolderModalProps {
  folder: Folder | null
  onOpenChange: (open: boolean) => void
  onSuccess: (message: string) => void
}
export default function EditFolderModal({ folder, onOpenChange, onSuccess }: EditFolderModalProps) {
  const { t } = useTranslation()
  const { updateFolder } = useFoldersStore()
  const FolderValidationSchema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .min(2, t("folders.nameMin"))
      .max(20, t("folders.nameMax"))
      .required(t("folders.nameRequired")),
    color: Yup.string().required(),
  })
  const editFormik = useFormik({
    initialValues: { name: "", color: "" },
    enableReinitialize: true,
    validationSchema: FolderValidationSchema,
    onSubmit: async (values) => {
      if (!folder) return
      onOpenChange(false)
      try {
        await updateFolder(folder.id, values.name, values.color)
        onSuccess(t("folders.successUpdate"))
      } catch (err: any) {
        onSuccess(`Error: ${err.message}`)
      }
    },
  })
  React.useEffect(() => {
    if (folder) {
      editFormik.setValues({
        name: folder.name,
        color: folder.color,
      })
    }
  }, [folder])
  return (
    <Dialog open={folder !== null} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-border bg-background max-w-md p-6 shadow-2xl z-50">
        <DialogHeader>
          <DialogTitle className="text-lg font-black text-foreground text-left">{t("folders.editFolderTitle")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={editFormik.handleSubmit} className="flex flex-col space-y-5 text-left mt-3">
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground ml-1">{t("folders.nameLabel")}</label>
            <input
              name="name"
              type="text"
              onChange={editFormik.handleChange}
              onBlur={editFormik.handleBlur}
              value={editFormik.values.name}
              placeholder={t("folders.namePlaceholder")}
              className="h-11 w-full px-4 rounded-xl border border-border bg-background/50 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
            />
            {editFormik.touched.name && editFormik.errors.name ? (
              <span className="text-[10px] text-rose-500 ml-1 font-bold">{editFormik.errors.name}</span>
            ) : null}
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-bold text-muted-foreground ml-1">{t("folders.colorLabel")}</label>
            <div className="flex items-center space-x-3.5 py-1">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => editFormik.setFieldValue("color", color)}
                  style={{
                    backgroundColor: color,
                    boxShadow: editFormik.values.color === color ? `0 0 12px ${color}` : "none",
                  }}
                  className={`h-8 w-8 rounded-full transition-all duration-300 ${
                    editFormik.values.color === color 
                      ? "ring-4 ring-offset-2 dark:ring-offset-zinc-950 scale-105" 
                      : "opacity-80 hover:opacity-100 hover:scale-105"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-border/50">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => onOpenChange(false)} 
              className="rounded-full text-xs font-bold"
            >
              {t("folders.cancelBtn")}
            </Button>
            <Button 
              type="submit"
              className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-6"
            >
              {t("folders.saveBtn")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}