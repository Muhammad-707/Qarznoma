import * as React from "react"
import { useTranslation } from "react-i18next"
import { User, Mail, Calendar, Edit2, Check, X, Copy, CheckCircle2, ShieldCheck, Lock, Eye, EyeOff, Camera, KeyRound, Sliders, LogOut, MoreHorizontal, Sparkles, Fingerprint } from "lucide-react"
import { useProfileStore } from "@/store/ProfileStore"
import { useLoginStore } from "@/store/AuthStore/LoginStore"
import { Button } from "@/components/ui/button"
export default function Profile() {
  const { t } = useTranslation()
  const { user, isLoading, error, fetchProfile, updateProfile, changePassword } = useProfileStore()
  const { logout } = useLoginStore()
  const [activeTab, setActiveTab] = React.useState<"personal" | "security" | "settings">("personal")
  const [nameInput, setNameInput] = React.useState("")
  const [isEditing, setIsEditing] = React.useState(false)
  const [oldPassword, setOldPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showOldPass, setShowOldPass] = React.useState(false)
  const [showNewPass, setShowNewPass] = React.useState(false)
  const [showConfirmPass, setShowConfirmPass] = React.useState(false)
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null)
  const [isCopied, setIsCopied] = React.useState(false)
  const [toast, setToast] = React.useState<{ text: string; isError?: boolean } | null>(null)
  React.useEffect(() => {
    fetchProfile()
  }, [fetchProfile])
  React.useEffect(() => {
    if (user) {
      setNameInput(user.name)
    }
  }, [user])
  const showToast = (message: string, isError = false) => {
    setToast({ text: message, isError })
    setTimeout(() => setToast(null), 4000)
  }
  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nameInput.trim()) {
      showToast(t("profile.errorNameBlank"), true)
      return
    }
    const success = await updateProfile(nameInput.trim())
    if (success) {
      showToast(t("profile.successUpdate"))
      setIsEditing(false)
    } else {
      showToast(error || "Failed to update profile", true)
    }
  }
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!oldPassword || !newPassword || !confirmPassword) {
      showToast(t("profile.errorPasswordFields"), true)
      return
    }
    if (newPassword.length < 6) {
      showToast(t("profile.errorPasswordLength"), true)
      return
    }
    if (newPassword !== confirmPassword) {
      showToast(t("profile.errorPasswordMismatch"), true)
      return
    }
    const success = await changePassword(oldPassword, newPassword)
    if (success) {
      showToast(t("profile.successPasswordUpdate"))
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } else {
      showToast(error || "Could not change password", true)
    }
  }
  const handleCopyId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id)
      setIsCopied(true)
      showToast(t("profile.successCopyId"))
      setTimeout(() => setIsCopied(false), 3000)
    }
  }
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast(t("profile.errorAvatarSize"), true)
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
        showToast(t("profile.successAvatarPreview"))
      }
      reader.readAsDataURL(file)
    }
  }
  const formatDate = (isoString: string) => {
    if (!isoString) return ""
    const date = new Date(isoString)
    return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
  }
  const userInitials = nameInput ? nameInput.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "AB"
  const renderUserAvatar = () => {
    if (avatarPreview) {
      return (
        <img
          src={avatarPreview}
          alt={nameInput || "Avatar"}
          className="h-full w-full object-cover rounded-full"
        />
      )
    }
    return (
      <span className="bg-gradient-to-r from-[#3b82f6] via-[#8b5cf6] to-[#ec4899] bg-clip-text text-transparent font-black">
        {userInitials}
      </span>
    )
  }
  return (
    <div className="w-full flex flex-col space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto px-4 sm:px-6 pb-36 lg:pb-24 select-none relative">
      <div className="absolute top-[-10%] left-[5%] w-[350px] h-[350px] bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] right-[5%] w-[400px] h-[400px] bg-pink-500/10 dark:bg-pink-500/5 blur-[130px] rounded-full pointer-events-none" />
      <div className="relative p-[1px] rounded-[32px] bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 shadow-[0_10px_30px_rgba(139,92,246,0.05)] overflow-hidden">
        <div className="relative border-0 bg-background/70 backdrop-blur-xl rounded-[31px] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 text-left">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
          <div className="relative group shrink-0 z-10">
            <div className="p-[3.5px] rounded-full bg-gradient-to-tr from-[#3b82f6] via-[#8b5cf6] to-[#ec4899] shadow-[0_0_25px_rgba(139,92,246,0.35)] transition-all duration-300 group-hover:scale-[1.04]">
              <div className="h-24 w-24 rounded-full bg-background overflow-hidden flex items-center justify-center text-white text-3xl font-black relative">
                {renderUserAvatar()}
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 rounded-full">
                  <Camera className="h-5 w-5 text-white animate-in zoom-in-50 duration-200" />
                  <span className="text-[8px] uppercase tracking-wider font-extrabold mt-1 text-white/95">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col sm:items-start items-center text-center sm:text-left space-y-1 z-10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
              <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
                {user?.name || "Loading..."}
                <Sparkles className="h-5 w-5 text-purple-500 animate-pulse hidden sm:inline" />
              </h2>
              <div className="flex items-center space-x-1 self-center bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase text-indigo-500 shadow-sm">
                {t("profile.activeMember")}
              </div>
            </div>
            <span className="text-xs text-muted-foreground font-semibold">{user?.email || "Retrieving..."}</span>
            <div className="flex items-center space-x-2 mt-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20 text-[10px] font-bold text-indigo-500 shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{t("profile.ownerPrivileges")}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start relative z-10">
        <div className="lg:col-span-1 border border-border/60 bg-background/70 backdrop-blur-xl rounded-[24px] p-2.5 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible shrink-0 gap-1.5 scrollbar-none shadow-sm">
          <button
            onClick={() => setActiveTab("personal")}
            className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl text-xs font-black shrink-0 transition-all duration-300 ${activeTab === "personal"
                ? "bg-gradient-to-r from-[#3b82f6] via-[#8b5cf6] to-[#ec4899] text-white shadow-[0_8px_25px_rgba(139,92,246,0.35)] border-0 scale-[1.02]"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
          >
            <User className="h-4.5 w-4.5" />
            <span>{t("profile.tabProfileInfo")}</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("security")
              setIsEditing(false)
            }}
            className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl text-xs font-black shrink-0 transition-all duration-300 ${activeTab === "security"
                ? "bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white shadow-[0_8px_25px_rgba(236,72,153,0.35)] border-0 scale-[1.02]"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
          >
            <KeyRound className="h-4.5 w-4.5" />
            <span>{t("profile.tabSecurity")}</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("settings")
              setIsEditing(false)
            }}
            className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl text-xs font-black shrink-0 transition-all duration-300 ${activeTab === "settings"
                ? "bg-gradient-to-r from-[#ec4899] to-[#f43f5e] text-white shadow-[0_8px_25px_rgba(244,63,94,0.35)] border-0 scale-[1.02]"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
          >
            <Sliders className="h-4.5 w-4.5" />
            <span>{t("profile.tabSettings")}</span>
          </button>
        </div>
        <div className="lg:col-span-3 p-[1px] rounded-[32px] bg-gradient-to-b from-border/50 via-border/20 to-border/50 shadow-md">
          <div className="bg-background/70 backdrop-blur-xl rounded-[31px] p-6 sm:p-8 min-h-[440px] text-left relative flex flex-col justify-between">
            {isLoading ? (
              <div className="h-64 w-full flex flex-col items-center justify-center space-y-4 animate-pulse">
                <div className="h-10 w-full max-w-sm bg-muted/60 rounded-xl" />
                <div className="h-10 w-full max-w-sm bg-muted/60 rounded-xl" />
              </div>
            ) : (
              <>
                {activeTab === "personal" && (
                  <div className="space-y-6 animate-in fade-in duration-300 w-full">
                    <div className="flex items-center justify-between border-b border-border/40 pb-4">
                      <div className="flex flex-col">
                        <h4 className="text-base font-black text-foreground">{t("profile.personalTitle")}</h4>
                        <p className="text-[10px] text-muted-foreground font-bold mt-0.5 uppercase tracking-wider">{t("profile.personalSubtitle")}</p>
                      </div>
                      {!isEditing && (
                        <Button
                          onClick={() => setIsEditing(true)}
                          variant="outline"
                          className="rounded-xl h-9 text-xs font-extrabold text-indigo-500 border-indigo-500/20 hover:bg-indigo-500/10 hover:text-indigo-600 gap-1.5 px-4 transition-all duration-300 hover:scale-[1.02]"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          {t("dashboard.editRecordBtn")}
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
                      <form onSubmit={handleSaveName} className="space-y-5 md:col-span-3">
                        <div className="flex flex-col space-y-2">
                          <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                            {t("folders.nameLabel")}
                          </label>
                          <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-indigo-500 transition-colors" />
                            <input
                              type="text"
                              disabled={!isEditing}
                              value={nameInput}
                              onChange={(e) => setNameInput(e.target.value)}
                              className="h-11 w-full pl-11 pr-4 rounded-xl border border-border/80 bg-background/50 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-75 disabled:cursor-not-allowed transition-all"
                              placeholder="Your display name"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                              {t("auth.email")}
                            </label>
                            <span className="text-[9px] bg-muted px-2 py-0.5 rounded font-black text-muted-foreground flex items-center gap-1 uppercase">
                              <Lock className="h-2.5 w-2.5" /> {t("profile.locked")}
                            </span>
                          </div>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                            <input
                              type="email"
                              disabled
                              value={user?.email || ""}
                              className="h-11 w-full pl-11 pr-4 rounded-xl border border-border/40 bg-background/20 text-xs font-semibold text-muted-foreground/75 cursor-not-allowed"
                            />
                          </div>
                        </div>
                        {isEditing && (
                          <div className="flex items-center space-x-3 pt-4 border-t border-border/40 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <Button
                              type="submit"
                              className="flex-1 rounded-xl h-11 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-xs gap-1.5 shadow-md border-0 transition-all hover:scale-[1.01]"
                            >
                              <Check className="h-4 w-4" />
                              {t("dashboard.saveChangesBtn")}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setIsEditing(false)
                                setNameInput(user?.name || "")
                              }}
                              className="rounded-xl h-11 text-xs font-bold gap-1.5 px-6"
                            >
                              <X className="h-4 w-4" />
                              {t("folders.cancelBtn")}
                            </Button>
                          </div>
                        )}
                      </form>
                      <div className="md:col-span-2 flex flex-col space-y-3 items-center md:items-start text-left">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                          {t("profile.systemCardPreview")}
                        </span>
                        <div className="w-full relative p-[1px] rounded-[28px] bg-slate-200/80 dark:bg-gradient-to-tr dark:from-[#3b82f6] dark:via-[#8b5cf6] dark:to-[#ec4899] shadow-sm dark:shadow-[0_10px_25px_rgba(139,92,246,0.15)] overflow-hidden transition-all duration-300">
                          <div className="relative bg-white dark:bg-gradient-to-tr dark:from-slate-950/95 dark:via-indigo-950/90 dark:to-purple-950/95 rounded-[27px] p-5 flex flex-col justify-between min-h-[200px] transition-all duration-300">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-b from-[#ec4899]/15 to-[#8b5cf6]/0 blur-xl rounded-full pointer-events-none hidden dark:block" />
                            <div className="flex justify-between items-start z-10">
                              <div className="h-12 w-12 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 text-sm font-black border border-purple-100 dark:border-purple-500/30 shadow-sm">
                                {userInitials}
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-[9px] bg-blue-100 dark:bg-gradient-to-r dark:from-blue-500 dark:to-indigo-500 text-blue-600 dark:text-white border border-blue-200 dark:border-white/10 px-2 py-0.5 rounded-full font-black uppercase shadow-sm">
                                  {t("profile.you")}
                                </span>
                                <button type="button" className="text-slate-400 dark:text-white/75 hover:text-slate-600 dark:hover:text-white transition-colors">
                                  <MoreHorizontal className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <div className="mt-5 space-y-1 z-10">
                              <h5 className="text-md font-black text-slate-900 dark:text-white tracking-tight">
                                {nameInput || "AA BB"}
                              </h5>
                              <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 dark:text-white/70 font-semibold">
                                <Mail className="h-3.5 w-3.5 text-slate-400 dark:text-white/50" />
                                <span className="truncate">{user?.email || "aa@gmail.com"}</span>
                              </div>
                            </div>
                            <div className="border-t border-slate-100 dark:border-white/10 my-4" />
                            <div className="grid grid-cols-2 gap-2 text-center z-10">
                              <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl py-1.5">
                                <span className="text-[8px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-wide flex items-center gap-1">
                                  <Calendar className="h-2.5 w-2.5" /> {t("profile.created")}
                                </span>
                                <span className="text-[10px] font-black text-slate-800 dark:text-white mt-0.5">
                                  {user?.created_at ? formatDate(user.created_at) : "Jun 18, 2026"}
                                </span>
                              </div>
                              <div className="flex flex-col items-center justify-center bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 rounded-xl py-1.5">
                                <span className="text-[8px] font-black uppercase text-purple-600 dark:text-purple-400 tracking-wide flex items-center gap-1">
                                  <ShieldCheck className="h-2.5 w-2.5" /> {t("users.privilegeLabel")}
                                </span>
                                <span className="text-[10px] font-black text-purple-600 dark:text-purple-300 mt-0.5">
                                  Admin
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "security" && (
                  <div className="space-y-6 animate-in fade-in duration-300 w-full">
                    <div className="flex flex-col border-b border-border/40 pb-4">
                      <h4 className="text-base font-black text-foreground">{t("profile.securityTitle")}</h4>
                      <p className="text-[10px] text-muted-foreground font-bold mt-0.5 uppercase tracking-wider">{t("profile.securitySubtitle")}</p>
                    </div>
                    <form onSubmit={handlePasswordChange} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      <div className="space-y-4">
                        <div className="flex flex-col space-y-2">
                          <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                            {t("profile.currentPassword")}
                          </label>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-[#8b5cf6] transition-colors" />
                            <input
                              type={showOldPass ? "text" : "password"}
                              value={oldPassword}
                              onChange={(e) => setOldPassword(e.target.value)}
                              className="h-11 w-full pl-11 pr-11 rounded-xl border border-border/80 bg-background/50 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              onClick={() => setShowOldPass(!showOldPass)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground shrink-0"
                            >
                              {showOldPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                            {t("profile.newPassword")}
                          </label>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-[#8b5cf6] transition-colors" />
                            <input
                              type={showNewPass ? "text" : "password"}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="h-11 w-full pl-11 pr-11 rounded-xl border border-border/80 bg-background/50 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                              placeholder="At least 6 characters"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPass(!showNewPass)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground shrink-0"
                            >
                              {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                            {t("profile.confirmPassword")}
                          </label>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-[#8b5cf6] transition-colors" />
                            <input
                              type={showConfirmPass ? "text" : "password"}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="h-11 w-full pl-11 pr-11 rounded-xl border border-border/80 bg-background/50 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                              placeholder="Re-enter new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPass(!showConfirmPass)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground shrink-0"
                            >
                              {showConfirmPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        <Button
                          type="submit"
                          className="w-full rounded-xl h-11 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-extrabold text-xs shadow-md border-0 transition-all duration-300 hover:scale-[1.01]"
                        >
                          {t("profile.updatePasswordBtn")}
                        </Button>
                      </div>
                      <div className="p-[1.5px] rounded-[24px] bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30">
                        <div className="bg-background/80 rounded-[23px] p-5 space-y-4 text-left">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8b5cf6] flex items-center gap-1.5">
                            <Fingerprint className="h-4 w-4" /> {t("profile.securityGuidelines")}
                          </span>
                          <ul className="space-y-3 text-xs text-muted-foreground font-semibold">
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{t("profile.guideline1")}</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{t("profile.guideline2")}</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{t("profile.guideline3")}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
                {activeTab === "settings" && (
                  <div className="space-y-6 animate-in fade-in duration-300 w-full">
                    <div className="flex flex-col text-left border-b border-border/40 pb-4">
                      <h4 className="text-base font-black text-foreground">{t("profile.settingsTitle")}</h4>
                      <p className="text-[10px] text-muted-foreground font-bold mt-0.5 uppercase tracking-wider">{t("profile.settingsSubtitle")}</p>
                    </div>
                    <div className="space-y-5">
                      {user?.id && (
                        <div className="flex flex-col space-y-2 text-left">
                          <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                            {t("profile.uuidLabel")}
                          </label>
                          <div className="flex items-center space-x-2 w-full">
                            <input
                              type="text"
                              disabled
                              value={user.id}
                              className="h-11 flex-1 px-4 rounded-xl border border-border/60 bg-background/20 text-xs font-mono text-muted-foreground/85 cursor-not-allowed"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleCopyId}
                              className="h-11 w-11 rounded-xl flex items-center justify-center p-0 hover:bg-muted border-border/80 transition-transform duration-200 active:scale-95"
                              title="Copy Account ID"
                            >
                              {isCopied ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              ) : (
                                <Copy className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                      {user?.created_at && (
                        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 border border-indigo-500/10 rounded-2xl text-left">
                          <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shrink-0 shadow-md">
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#3b82f6] block">{t("profile.regDate")}</span>
                            <span className="text-sm text-foreground font-black mt-0.5 block">{formatDate(user.created_at)}</span>
                          </div>
                        </div>
                      )}
                      <div className="p-[1px] rounded-2xl bg-gradient-to-r from-red-500/20 to-rose-500/20">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-rose-500/[0.02] dark:bg-rose-500/[0.01] rounded-2xl text-left gap-4">
                          <div>
                            <span className="text-sm font-black text-foreground block">{t("profile.sessionLogoutTitle")}</span>
                            <span className="text-xs text-muted-foreground font-semibold block mt-1">{t("profile.sessionLogoutDesc")}</span>
                          </div>
                          <Button
                            onClick={() => logout()}
                            className="rounded-xl h-11 px-6 bg-gradient-to-r from-red-500 to-rose-600 hover:scale-[1.02] transition-transform text-white font-extrabold text-xs border-0 gap-1.5 shadow-[0_5px_15px_rgba(239,68,68,0.25)]"
                          >
                            <LogOut className="h-4 w-4" />
                            {t("profile.logoutBtn")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] border px-5 py-3.5 shadow-2xl flex items-center gap-3 rounded-2xl animate-in slide-in-from-top-5 duration-300
          ${toast.isError
            ? "bg-gradient-to-r from-red-600 to-rose-600 border-rose-500/30"
            : "bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] border-white/20"
          }`}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-pulse" />
          <span className="text-xs font-bold text-white tracking-wide">{toast.text}</span>
        </div>
      )}
    </div>
  )
}

