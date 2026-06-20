import * as React from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useTranslation } from "react-i18next"
import { Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useContactsStore, type Contact } from "@/store/ContactsStore"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
interface EditContactModalProps {
  contact: Contact | null
  onOpenChange: (open: boolean) => void
  onSuccess: (message: string) => void
}
export default function EditContactModal({ contact, onOpenChange, onSuccess }: EditContactModalProps) {
  const { t } = useTranslation()
  const { folders, updateContact } = useContactsStore()
  const ContactValidationSchema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .min(2, t("folders.nameMin"))
      .max(30, t("contacts.nameMaxLimit"))
      .required(t("folders.nameRequired")),
    phone: Yup.string().nullable(),
    email: Yup.string().email(t("auth.invalidEmail")).nullable(),
    note: Yup.string().max(100, t("contacts.noteMaxLimit")).nullable(),
    folder_id: Yup.string().nullable(),
  })
  const formik = useFormik({
    initialValues: { name: "", phone: "", email: "", note: "", folder_id: "" },
    enableReinitialize: true,
    validationSchema: ContactValidationSchema,
    onSubmit: async (values) => {
      if (!contact) return
      onOpenChange(false)
      try {
        await updateContact(contact.id, values)
        onSuccess(t("contacts.successUpdate"))
      } catch (err: any) {
        console.error(err)
        onSuccess(t("contacts.errorUpdate"))
      }
    },
  })
  React.useEffect(() => {
    if (contact) {
      formik.setValues({
        name: contact.name,
        phone: contact.phone || "",
        email: contact.email || "",
        note: contact.note || "",
        folder_id: contact.folder_id || "",
      })
    }
  }, [contact])
  return (
    <Dialog open={contact !== null} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border border-zinc-200/40 dark:border-zinc-800/40 bg-background max-w-md p-6 shadow-2xl z-50">
        <DialogHeader>
          <DialogTitle className="text-lg font-black text-foreground text-left flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-indigo-500" />
            {t("contacts.editContactTitle")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="flex flex-col space-y-4.5 text-left mt-3">
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold text-muted-foreground ml-1">{t("contacts.nameLabel")}</label>
            <input
              name="name"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className="h-10 w-full px-4 rounded-xl border border-border bg-background/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
            />
            {formik.touched.name && formik.errors.name ? (
              <span className="text-[10px] text-rose-500 ml-1 font-bold">{formik.errors.name}</span>
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-muted-foreground ml-1">{t("contacts.phoneLabel")}</label>
              <input
                name="phone"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
                className="h-10 w-full px-4 rounded-xl border border-border bg-background/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-muted-foreground ml-1">{t("auth.email")}</label>
              <input
                name="email"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="h-10 w-full px-4 rounded-xl border border-border bg-background/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
              />
              {formik.touched.email && formik.errors.email ? (
                <span className="text-[10px] text-rose-500 ml-1 font-bold">{formik.errors.email}</span>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold text-muted-foreground ml-1">{t("contacts.folderGroupLabel")}</label>
            <select
              name="folder_id"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.folder_id}
              className="h-10 w-full px-4 rounded-xl border border-border bg-background/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
            >
              <option value="">{t("contacts.noGroup")}</option>
              {folders.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold text-muted-foreground ml-1">{t("dashboard.noteLabel")}</label>
            <input
              name="note"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.note}
              className="h-10 w-full px-4 rounded-xl border border-border bg-background/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
            />
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