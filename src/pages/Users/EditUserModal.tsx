import * as React from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useTranslation } from "react-i18next"
import { Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUsersStore, type ManagedUser } from "@/store/UsersStore"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
interface EditUserModalProps {
  user: ManagedUser | null
  onOpenChange: (open: boolean) => void
  onSuccess: (message: string) => void
}
export default function EditUserModal({ user, onOpenChange, onSuccess }: EditUserModalProps) {
  const { t } = useTranslation()
  const { updateUser } = useUsersStore()
  const UserValidationSchema = Yup.object().shape({
    name: Yup.string().trim().min(2, t("folders.nameMin")).required(t("users.required")),
    email: Yup.string().email(t("auth.invalidEmail")).required(t("users.required")),
    role: Yup.string().oneOf(["Admin", "User"]).required(t("users.required")),
  })
  const formik = useFormik({
    initialValues: { name: "", email: "", role: "User" },
    enableReinitialize: true,
    validationSchema: UserValidationSchema,
    onSubmit: async (values) => {
      if (!user) return
      onOpenChange(false)
      try {
        await updateUser(user.id, values.name, values.email, values.role as "Admin" | "User")
        onSuccess(t("users.successUpdateUser"))
      } catch {
        onSuccess(t("users.errorUpdateUser"))
      }
    },
  })
  React.useEffect(() => {
    if (user) {
      formik.setValues({
        name: user.name,
        email: user.email,
        role: user.role,
      })
    }
  }, [user])
  return (
    <Dialog open={user !== null} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border border-zinc-200/40 dark:border-zinc-800/40 bg-background max-w-md p-6 shadow-2xl z-50">
        <DialogHeader>
          <DialogTitle className="text-lg font-black text-foreground text-left flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-indigo-500" />
            {t("users.editUserTitle")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="flex flex-col space-y-4.5 text-left mt-3">
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold text-muted-foreground ml-1">{t("folders.nameLabel")}</label>
            <input
              name="name"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className="h-10 w-full px-4 rounded-xl border border-border bg-background/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
            />
            {formik.touched.name && formik.errors.name ? (
              <span className="text-[10px] text-rose-500 ml-1 font-bold">{formik.errors.name}</span>
            ) : null}
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold text-muted-foreground ml-1">{t("users.emailAddressLabel")}</label>
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
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold text-muted-foreground ml-1">{t("users.privilegeRoleLabel")}</label>
            <select
              name="role"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.role}
              className="h-10 w-full px-4 rounded-xl border border-border bg-background/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
            >
              <option value="User">{t("users.roleUserDesc")}</option>
              <option value="Admin">{t("users.roleAdminDesc")}</option>
            </select>
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
              className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-6 shadow-md active:scale-95 transition-all"
            >
              {t("folders.saveBtn")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}