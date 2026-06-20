import * as React from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useTranslation } from "react-i18next"
import { Coins, ChevronDown, UserPlus, FolderPlus, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDashboardStore } from "@/store/DashboardStore"
import { useDebtsStore } from "@/store/DebtsStore"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
interface AddDebtModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (message: string) => void
  defaultDirection: string
}
export function AddDebtModal({ isOpen, onOpenChange, onSuccess, defaultDirection }: AddDebtModalProps) {
  const { t } = useTranslation()
  const { contacts, folders, addDebt, addContact, addFolder } = useDashboardStore()
  const [isContactOpen, setIsContactOpen] = React.useState(false)
  const [isFolderOpen, setIsFolderOpen] = React.useState(false)
  const [newContactName, setNewContactName] = React.useState("")
  const [newFolderName, setNewFolderName] = React.useState("")
  const formik = useFormik({
    initialValues: {
      contact_id: "",
      amount: "",
      direction: defaultDirection,
      folder_id: "",
      due_date: "",
      description: "",
    },
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      if (!values.contact_id || !values.amount || !values.due_date || !values.description) {
        alert(t("dashboard.alertFillFields"))
        return
      }
      onOpenChange(false)
      try {
        const payload = {
          contact_id: values.contact_id,
          direction: values.direction,
          amount: Number(values.amount),
          currency: "USD",
          description: values.description,
          due_date: values.due_date,
        }
        await addDebt(payload)
        try {
          await useDebtsStore.getState().fetchDebtsPageData(true)
        } catch (e) {
          console.error("Sync failed:", e)
        }
        resetForm()
        onSuccess?.("✓ New debt logged successfully!")
      } catch (err) {
        console.error("Failed to add debt:", err)
      }
    },
  })
  const handleQuickAddContact = async () => {
    if (!newContactName.trim()) return
    try {
      const created = await addContact(newContactName.trim())
      formik.setFieldValue("contact_id", created.id)
      setNewContactName("")
      setIsContactOpen(false)
    } catch (err) {
      console.error(err)
    }
  }
  const handleQuickAddFolder = async () => {
    if (!newFolderName.trim()) return
    try {
      const created = await addFolder(newFolderName.trim(), "#8b5cf6")
      formik.setFieldValue("folder_id", created.id)
      setNewFolderName("")
      setIsFolderOpen(false)
    } catch (err) {
      console.error(err)
    }
  }
  const selectedContact = contacts.find(c => c.id === formik.values.contact_id)
  const selectedFolder = folders.find(f => f.id === formik.values.folder_id)
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border border-zinc-200/40 dark:border-zinc-800/40 bg-background max-w-md p-6 shadow-2xl z-50 overflow-visible animate-in fade-in duration-200">
        <DialogHeader>
          <DialogTitle className="text-lg font-black text-foreground flex items-center gap-2 border-b border-border/50 pb-3">
            <Coins className="h-5 w-5 text-indigo-500" />
            {t("dashboard.addDebtTitle")}
            <Sparkles className="h-4 w-4 text-indigo-500 animate-pulse" />
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="flex flex-col space-y-4 text-left mt-3 overflow-visible">
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground ml-1">Title</label>
            <input
              type="text"
              id="description"
              name="description"
              onChange={formik.handleChange}
              value={formik.values.description}
              placeholder="Loan, dinner, rent..."
              className="h-10.5 w-full px-4 rounded-xl border border-border bg-background/50 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 overflow-visible">
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground ml-1">Direction</label>
              <div className="grid grid-cols-2 gap-1 bg-muted/40 p-1 rounded-xl border border-border/60">
                <button
                  type="button"
                  onClick={() => formik.setFieldValue("direction", "they_owe_me")}
                  className={`h-8.5 rounded-lg text-[10px] font-bold transition-all ${
                    formik.values.direction === "they_owe_me"
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t("section1.owesMe")}
                </button>
                <button
                  type="button"
                  onClick={() => formik.setFieldValue("direction", "i_owe_them")}
                  className={`h-8.5 rounded-lg text-[10px] font-bold transition-all ${
                    formik.values.direction === "i_owe_them"
                      ? "bg-rose-500 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t("section1.iOwe")}
                </button>
              </div>
            </div>
            <div className="flex flex-col space-y-1.5 relative overflow-visible">
              <label className="text-xs font-bold text-muted-foreground ml-1">Contact</label>
              <button
                type="button"
                onClick={() => {
                  setIsContactOpen(!isContactOpen)
                  setIsFolderOpen(false)
                }}
                className="h-10.5 w-full px-4 rounded-xl border border-border bg-background/50 text-xs font-semibold text-foreground flex items-center justify-between focus:outline-none hover:bg-accent/30 transition-all"
              >
                <span className="truncate">{selectedContact ? selectedContact.name : t("dashboard.selectContact")}</span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isContactOpen ? "rotate-180" : ""}`} />
              </button>
              {isContactOpen && (
                <div className="absolute top-12 left-0 right-0 max-h-56 bg-background border border-border/80 rounded-2xl shadow-xl p-2.5 z-[100] flex flex-col space-y-2 overflow-y-auto overflow-x-hidden animate-in fade-in-50 slide-in-from-top-2 duration-150">
                  <div className="flex flex-col max-h-32 overflow-y-auto space-y-1">
                    {contacts.map((contact) => (
                      <button
                        key={contact.id}
                        type="button"
                        onClick={() => {
                          formik.setFieldValue("contact_id", contact.id)
                          setIsContactOpen(false)
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-accent transition-all ${
                          formik.values.contact_id === contact.id ? "bg-accent text-indigo-500" : ""
                        }`}
                      >
                        {contact.name}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-border/40 pt-2 flex items-center gap-1.5 w-full">
                    <input
                      type="text"
                      placeholder={t("dashboard.addNewPlaceholder")}
                      value={newContactName}
                      onChange={(e) => setNewContactName(e.target.value)}
                      className="h-8 flex-1 min-w-0 px-2.5 rounded-lg border border-border bg-background text-[10px] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleQuickAddContact}
                      className="h-8 w-8 shrink-0 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center transition-all"
                    >
                      <UserPlus className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 overflow-visible">
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground ml-1">{t("dashboard.amountLabel")}</label>
              <input
                type="number"
                id="amount"
                name="amount"
                onChange={formik.handleChange}
                value={formik.values.amount}
                placeholder={t("dashboard.enterAmountPlaceholder")}
                className="h-10.5 w-full px-4 rounded-xl border border-border bg-background/50 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="flex flex-col space-y-1.5 relative overflow-visible">
              <label className="text-xs font-bold text-muted-foreground ml-1">{t("dashboard.folderLabel")}</label>
              <button
                type="button"
                onClick={() => {
                  setIsFolderOpen(!isFolderOpen)
                  setIsContactOpen(false)
                }}
                className="h-10.5 w-full px-4 rounded-xl border border-border bg-background/50 text-xs font-semibold text-foreground flex items-center justify-between focus:outline-none hover:bg-accent/30 transition-all"
              >
                <span className="truncate">{selectedFolder ? selectedFolder.name : t("dashboard.noFolder")}</span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isFolderOpen ? "rotate-180" : ""}`} />
              </button>
              {isFolderOpen && (
                <div className="absolute top-12 left-0 right-0 max-h-56 bg-background border border-border/80 rounded-2xl shadow-xl p-2.5 z-[100] flex flex-col space-y-2 overflow-y-auto overflow-x-hidden animate-in fade-in-50 slide-in-from-top-2 duration-150">
                  <div className="flex flex-col max-h-32 overflow-y-auto space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        formik.setFieldValue("folder_id", "")
                        setIsFolderOpen(false)
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-accent text-zinc-500"
                    >
                      {t("dashboard.noFolder")}
                    </button>
                    {folders.map((folder) => (
                      <button
                        key={folder.id}
                        type="button"
                        onClick={() => {
                          formik.setFieldValue("folder_id", folder.id)
                          setIsFolderOpen(false)
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-accent transition-all ${
                          formik.values.folder_id === folder.id ? "bg-accent text-indigo-500" : ""
                        }`}
                      >
                        {folder.name}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-border/60 pt-2 flex items-center gap-1.5 w-full">
                    <input
                      type="text"
                      placeholder={t("dashboard.addFolderPlaceholder")}
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      className="h-8 flex-1 min-w-0 px-2.5 rounded-lg border border-border bg-background text-[10px] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleQuickAddFolder}
                      className="h-8 w-8 shrink-0 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center transition-all"
                    >
                      <FolderPlus className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground ml-1">{t("dashboard.dueDateLabel")}</label>
            <input
              type="date"
              id="due_date"
              name="due_date"
              onChange={formik.handleChange}
              value={formik.values.due_date}
              className="h-10.5 w-full px-4 rounded-xl border border-border bg-background/50 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border/50">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-full px-5 py-2 hover:bg-accent/40 font-semibold text-xs"
            >
              {t("dashboard.cancelBtn")}
            </Button>
            <Button
              type="submit"
              className="rounded-full px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 border-0 font-bold text-white text-xs shadow-md active:scale-95 transition-transform"
            >
              {t("dashboard.saveBtn")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}