import * as React from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Moon, Sun, Menu, X } from "lucide-react"
import { useTheme } from "@/lib/ThemeProvider"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
const languages = {
    en: { label: "EN", color: "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" },
    ru: { label: "RU", color: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" },
    tj: { label: "TJ", color: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" },
}
export function Header() {
    const { setTheme, theme } = useTheme()
    const { t, i18n } = useTranslation()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
    const activeLang = i18n.language || "en"
    const currentLang = languages[activeLang as keyof typeof languages] || languages.en
    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault()
        const element = document.getElementById(targetId)
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" })
            setIsMobileMenuOpen(false)
        }
    }
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
            <div className="container flex h-16 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto relative">
                <Link to="/" className="flex items-center space-x-3 group z-50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] via-[#8b5cf6] to-[#ec4899] text-white font-black text-lg shadow-sm group-hover:scale-105 transition-transform duration-300">
                        A
                    </div>
                    <span className="font-bold text-xl tracking-tight text-foreground flex items-center gap-1.5">
                        Ad1
                        <span className="bg-gradient-to-r from-[#3b82f6] to-[#ec4899] bg-clip-text text-transparent font-extrabold">
                            5:8
                        </span>
                    </span>
                </Link>
                <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-muted-foreground">
                    <a href="#features" onClick={(e) => handleScroll(e, "features")} className="hover:text-foreground transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-foreground after:transition-all after:duration-300">
                        {t("header.features")}
                    </a>
                    <a href="#stats" onClick={(e) => handleScroll(e, "stats")} className="hover:text-foreground transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-foreground after:transition-all after:duration-300">
                        {t("header.stats")}
                    </a>
                    <a href="#how-it-works" onClick={(e) => handleScroll(e, "how-it-works")} className="hover:text-foreground transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-foreground after:transition-all after:duration-300">
                        {t("header.howItWorks")}
                    </a>
                </nav>
                <div className="flex items-center space-x-3 sm:space-x-5 z-50">
                    <div className="relative">
                        {/* ИСПРАВЛЕНО: Добавлено сохранение выбранного языка в i18nextLng при событии onValueChange */}
                        <Select 
                            value={activeLang} 
                            onValueChange={(val) => {
                                i18n.changeLanguage(val)
                                localStorage.setItem("i18nextLng", val)
                            }}
                        >
                            <SelectTrigger className="h-9 w-[80px] sm:w-[88px] rounded-full border border-border/60 bg-background/40 backdrop-blur-md px-2.5 sm:px-3 text-xs font-semibold hover:border-foreground/30 hover:bg-background/80 transition-all duration-300 focus:ring-1 focus:ring-ring">
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <span className={`h-2 w-2 rounded-full ${currentLang.color} animate-pulse`} />
                                    <span className="font-semibold text-foreground tracking-wide text-[11px] sm:text-xs">
                                        {currentLang.label}
                                    </span>
                                </div>
                            </SelectTrigger>
                            <SelectContent position="popper" align="end" sideOffset={5} className="rounded-2xl border-border/80 bg-background/95 backdrop-blur-md min-w-[110px] p-1 shadow-xl z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                                <SelectItem value="en" className="rounded-xl focus:bg-accent cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                        <span className="font-medium text-xs">English</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="ru" className="rounded-xl focus:bg-accent cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                        <span className="font-medium text-xs">Русский</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="tj" className="rounded-xl focus:bg-accent cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        <span className="font-medium text-xs">Тоҷикӣ</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="relative h-9 w-9 rounded-full overflow-hidden border transition-all duration-500 ease-out focus-visible:ring-2 focus-visible:ring-ring bg-amber-50/50 hover:bg-amber-100/60 text-amber-600 border-amber-200/50 hover:border-amber-300 dark:bg-indigo-950/30 dark:hover:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/50 dark:hover:border-indigo-800"
                        aria-label="Toggle theme"
                    >
                        <Sun className="h-[1.15rem] w-[1.15rem] transform transition-all duration-500 ease-out rotate-0 scale-100 opacity-100 dark:-rotate-90 dark:scale-0 dark:opacity-0" />
                        <Moon className="absolute h-[1.15rem] w-[1.15rem] transform transition-all duration-500 ease-out rotate-90 scale-0 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100" />
                    </Button>
                    <div className="h-5 w-[1px] bg-border/80 hidden md:block" />
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            {t("header.login")}
                        </Link>
                        <Link to="/signup">
                            <Button className="relative rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_4px_20px_rgba(124,58,237,0.3)] active:scale-[0.98] bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] border-0 hover:opacity-95 shadow-md">
                                {t("header.signup")}
                            </Button>
                        </Link>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="h-9 w-9 rounded-full md:hidden flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent relative" aria-label="Toggle Menu">
                        <Menu className={`h-5 w-5 transform transition-all duration-300 ${isMobileMenuOpen ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`} />
                        <X className={`absolute h-5 w-5 transform transition-all duration-300 ${isMobileMenuOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`} />
                    </Button>
                </div>
            </div>
            <div className={`absolute left-0 right-0 border-b border-border bg-background/98 backdrop-blur-lg shadow-2xl p-6 flex flex-col space-y-6 md:hidden z-40 transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "top-16 opacity-100 translate-y-0 pointer-events-auto" : "top-10 opacity-0 -translate-y-4 pointer-events-none"}`}>
                <div className="flex flex-col space-y-4 text-left font-semibold text-base text-muted-foreground">
                    <a href="#features" onClick={(e) => handleScroll(e, "features")} className="hover:text-foreground transition-colors py-1.5 border-b border-border/40">
                        {t("header.features")}
                    </a>
                    <a href="#stats" onClick={(e) => handleScroll(e, "stats")} className="hover:text-foreground transition-colors py-1.5">
                        {t("header.stats")}
                    </a>
                    <a href="#how-it-works" onClick={(e) => handleScroll(e, "how-it-works")} className="hover:text-foreground transition-colors py-1.5 border-b border-border/40">
                        {t("header.howItWorks")}
                    </a>
                </div>
                <div className="h-[1px] bg-border/80 w-full" />
                <div className="flex flex-col space-y-3 w-full">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors border border-border rounded-full hover:bg-accent">
                        {t("header.login")}
                    </Link>
                    <Link to="/signup">
                        <Button onClick={() => setIsMobileMenuOpen(false)} className="w-full relative rounded-full py-5 text-sm font-bold text-white bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] border-0 shadow-lg">
                            {t("header.signup")}
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}