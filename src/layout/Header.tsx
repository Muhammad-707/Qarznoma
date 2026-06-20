import * as React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Check, 
  Sun, 
  Moon, 
  User as UserIcon, 
  LogOut 
} from "lucide-react"
import { useLoginStore } from "@/store/AuthStore/LoginStore"
interface LanguageOption {
  code: "en" | "ru" | "tj"
  shortLabel: string
  fullLabel: string
  color: string
}
const languages: LanguageOption[] = [
  { code: "en", shortLabel: "EN", fullLabel: "English", color: "bg-[#6366f1]" },
  { code: "ru", shortLabel: "RU", fullLabel: "Русский", color: "bg-[#ec4899]" },
  { code: "tj", shortLabel: "TJ", fullLabel: "Тоҷикӣ", color: "bg-[#10b981]" }
]
export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useLoginStore()
  const { t, i18n } = useTranslation()
  const desktopLangRef = React.useRef<HTMLDivElement>(null)
  const userMenuRef = React.useRef<HTMLDivElement>(null)
  const [desktopLangOpen, setDesktopLangOpen] = React.useState(false)
  const [mobileLangOpen, setMobileLangOpen] = React.useState(false)
  const [userMenuOpen, setUserMenuOpen] = React.useState(false)
  const [theme, setTheme] = React.useState<"light" | "dark" | null>(null)
  const activeLang = i18n.language || "en"
  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setTheme(prefersDark ? "dark" : "light")
    }
  }, [])
  React.useEffect(() => {
    if (!theme) return
    const root = window.document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    localStorage.setItem("theme", theme)
  }, [theme])
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
        setMobileLangOpen(false)
      }
      if (desktopLangRef.current && !desktopLangRef.current.contains(event.target as Node)) {
        setDesktopLangOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }
  const getPageTitle = () => {
    const path = location.pathname
    if (path === "/dashboard" || path === "/") {
      return `${t("auth.welcome")}, ${user?.name || "User"}!`
    }
    if (path === "/debts") return t("header.debts")
    if (path === "/folders") return t("header.folders")
    if (path === "/contacts") return t("header.contacts")
    if (path === "/users") return t("header.users")
    if (path === "/profile") return t("header.profile")
    return t("header.overview")
  }
  const activeLanguage = languages.find(l => l.code === activeLang) || languages[0]
  const userInitials = user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "AB"
  return (
    <header className="h-16 border-b border-border/40 bg-background/70 backdrop-blur-md px-6 flex items-center justify-between fixed top-0 left-0 lg:left-64 right-0 z-40 transition-all">
      <h1 className="text-xl font-black text-foreground tracking-tight">
        {getPageTitle()}
      </h1>
      <div className="flex items-center space-x-3.5 relative">
        <div className="relative w-44 sm:w-56 group hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
          <input 
            type="text"
            placeholder="Search anything..."
            className="h-9 w-full pl-9 pr-4 rounded-full border border-border/80 bg-background/50 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-ring focus:border-border transition-all"
          />
        </div>
        <div className="relative hidden md:block" ref={desktopLangRef}>
          <button 
            onClick={() => {
              setDesktopLangOpen(!desktopLangOpen)
              setUserMenuOpen(false)
            }}
            className="h-9 px-3.5 rounded-full border border-border/80 bg-background/50 hover:bg-accent/60 flex items-center space-x-2 text-xs font-extrabold text-foreground active:scale-95 transition-all select-none"
          >
            <span className={`h-2 w-2 rounded-full ${activeLanguage.color}`} />
            <span>{activeLanguage.shortLabel}</span>
            <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${desktopLangOpen ? "rotate-180" : ""}`} />
          </button>
          {desktopLangOpen && (
            <div className="absolute right-0 mt-2 w-36 border border-border/60 bg-background/95 backdrop-blur-md rounded-2xl p-1.5 shadow-lg z-50 text-left">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    i18n.changeLanguage(lang.code)
                    localStorage.setItem("i18nextLng", lang.code)
                    setDesktopLangOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeLang === lang.code 
                      ? "bg-accent text-foreground" 
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className={`h-2 w-2 rounded-full ${lang.color}`} />
                    <span>{lang.fullLabel}</span>
                  </div>
                  {activeLang === lang.code && <Check className="h-3.5 w-3.5 text-foreground stroke-[3px]" />}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="hidden md:block">
          <button 
            onClick={toggleTheme}
            className={`h-9 w-9 rounded-full flex items-center justify-center transition-all duration-300 border active:scale-95 shadow-sm
              ${theme === "light" 
                ? "bg-[#fffbeb] border-[#fef3c7] text-[#d97706] hover:bg-[#fef3c7]" 
                : "bg-[#1e1b4b] border-[#312e81] text-[#818cf8] hover:bg-[#312e81]"
              }`}
            title="Toggle Light/Dark Theme"
          >
            {theme === "light" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>
        </div>
        <button className="h-9 w-9 rounded-full border border-border/30 bg-background/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/60 relative active:scale-95 transition-all">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-pink-500 shadow-[0_0_8px_#ec4899] animate-pulse" />
        </button>
        <div className="relative" ref={userMenuRef}>
          <button 
            onClick={() => {
              setUserMenuOpen(!userMenuOpen)
              setDesktopLangOpen(false)
              setMobileLangOpen(false)
            }}
            className="h-9 w-9 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#ec4899] text-white text-xs font-black flex items-center justify-center shadow-md active:scale-95 transition-transform overflow-hidden cursor-pointer select-none"
          >
            {userInitials}
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 mt-2.5 w-64 border border-border/60 bg-background/95 backdrop-blur-md rounded-[24px] p-4.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 z-50 text-left">
              <div className="flex flex-col items-center justify-center text-center p-2">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#ec4899] text-white text-sm font-black flex items-center justify-center shadow-md">
                  {userInitials}
                </div>
                <h4 className="text-sm font-black text-foreground mt-3 truncate max-w-full">
                  {user?.name || "User Name"}
                </h4>
                <p className="text-[10px] font-semibold text-muted-foreground truncate max-w-full mt-0.5">
                  {user?.email || "user@example.com"}
                </p>
              </div>
              <div className="md:hidden block">
                <div className="border-t border-border/40 my-3" />
                <div className="flex items-center justify-between p-3 bg-muted/40 border border-border/40 rounded-2xl text-left relative">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground">App settings</span>
                    <span className="text-xs font-black text-foreground mt-0.5">Preferences</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <button
                        onClick={() => setMobileLangOpen(!mobileLangOpen)}
                        className="h-8 px-2.5 rounded-full border border-border/80 bg-background hover:bg-accent/60 flex items-center space-x-1.5 text-[11px] font-extrabold text-foreground active:scale-95 transition-all select-none"
                      >
                        <span className={`h-2 w-2 rounded-full ${activeLanguage.color}`} />
                        <span>{activeLanguage.shortLabel}</span>
                        <ChevronDown className="h-3 w-3" />
                      </button>
                      {mobileDropdown()}
                    </div>
                    <button 
                      onClick={toggleTheme}
                      className={`h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 border active:scale-95 shadow-sm
                        ${theme === "light" 
                          ? "bg-[#fffbeb] border-[#fef3c7] text-[#d97706]" 
                          : "bg-[#1e1b4b] border-[#312e81] text-[#818cf8]"
                        }`}
                    >
                      {theme === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="border-t border-border/40 my-3" />
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setUserMenuOpen(false)
                    navigate("/profile")
                  }}
                  className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-200"
                >
                  <UserIcon className="h-4 w-4 text-indigo-500" />
                  <span>Profile Page</span>
                </button>
                <button
                  onClick={async () => {
                    setUserMenuOpen(false)
                    await logout()
                  }}
                  className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4 text-red-500" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
  function mobileDropdown() {
    if (!mobileLangOpen) return null;
    return (
      <div className="absolute right-0 bottom-10 w-36 border border-border/60 bg-background/95 backdrop-blur-md rounded-2xl p-1.5 shadow-lg z-50 text-left animate-in fade-in slide-in-from-top-2 duration-150">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => {
              i18n.changeLanguage(lang.code)
              localStorage.setItem("i18nextLng", lang.code)
              setMobileLangOpen(false)
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-bold transition-all ${
              activeLang === lang.code 
                ? "bg-accent text-foreground" 
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className={`h-2 w-2 rounded-full ${lang.color}`} />
              <span>{lang.fullLabel}</span>
            </div>
            {activeLang === lang.code && <Check className="h-3.5 w-3.5 text-foreground stroke-[3px]" />}
          </button>
        ))}
      </div>
    )
  }
}