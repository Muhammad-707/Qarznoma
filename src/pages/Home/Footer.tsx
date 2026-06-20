import * as React from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { ArrowRight, Send, MessageCircle } from "lucide-react"
export function Footer() {
  const { t } = useTranslation()
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }
  return (
    <footer className="w-full bg-background/50 dark:bg-zinc-950/20 backdrop-blur-md border-t border-border/40 pt-16 pb-8 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none -z-10" />
      <div className="container px-4 md:px-8 max-w-7xl mx-auto flex flex-col">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 text-left">
          <div className="col-span-2 md:col-span-4 lg:col-span-2 flex flex-col space-y-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] via-[#8b5cf6] to-[#ec4899] text-white font-black text-base shadow-sm group-hover:scale-105 transition-transform duration-300">
                A
              </div>
              <span className="font-bold text-lg tracking-tight text-foreground flex items-center gap-1.5">
                Ad1 
                <span className="bg-gradient-to-r from-[#3b82f6] to-[#ec4899] bg-clip-text text-transparent font-extrabold">
                  5:8
                </span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              {t("footer.desc")}
            </p>
          </div>
          <div className="col-span-1 flex flex-col space-y-3.5">
            <span className="text-xs font-bold uppercase tracking-widest text-foreground">
              {t("footer.product")}
            </span>
            <a href="#features" onClick={(e) => handleScroll(e, "features")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("header.features")}
            </a>
            <a href="#how-it-works" onClick={(e) => handleScroll(e, "how-it-works")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("header.howItWorks")}
            </a>
            <a href="#stats" onClick={(e) => handleScroll(e, "stats")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("header.stats")}
            </a>
            <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("footer.pricing")}
            </Link>
            <Link to="/changelog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("footer.changelog")}
            </Link>
          </div>
          <div className="col-span-1 flex flex-col space-y-3.5">
            <span className="text-xs font-bold uppercase tracking-widest text-foreground">
              {t("footer.company")}
            </span>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("footer.about")}
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("footer.privacy")}
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("footer.terms")}
            </Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("footer.contact")}
            </Link>
          </div>
          <div className="col-span-2 md:col-span-2 lg:col-span-1 flex flex-col space-y-3.5">
            <span className="text-xs font-bold uppercase tracking-widest text-foreground">
              {t("footer.stayUpdated")}
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("footer.subscribe")}
            </p>
            <div className="flex items-center space-x-1.5 w-full max-w-sm mt-2">
              <input
                type="email"
                placeholder={t("footer.emailPlaceholder")}
                className="h-9 w-full rounded-full border border-border/60 bg-background/40 backdrop-blur-sm px-4 py-2 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
              />
              <Button size="icon" className="h-9 w-9 shrink-0 rounded-full text-white bg-gradient-to-r from-[#2563eb] to-[#7c3aed] border-0 hover:opacity-95 shadow-md flex items-center justify-center hover:scale-105 transition-all">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-border/50 to-transparent my-10" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground order-2 sm:order-1">
            {t("footer.rights")}
          </span>
          <div className="flex items-center space-x-3 order-1 sm:order-2">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full border border-border/60 bg-background/30 flex items-center justify-center text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:text-indigo-500 hover:border-indigo-500/40 hover:shadow-[0_0_12px_rgba(99,102,241,0.35)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full border border-border/60 bg-background/30 flex items-center justify-center text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:text-sky-500 hover:border-sky-500/40 hover:shadow-[0_0_12px_rgba(14,165,233,0.35)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
            <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full border border-border/60 bg-background/30 flex items-center justify-center text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:text-emerald-500 hover:border-emerald-500/40 hover:shadow-[0_0_12px_rgba(16,185,129,0.35)]">
              <Send className="h-3.5 w-3.5" />
            </a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full border border-border/60 bg-background/30 flex items-center justify-center text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:text-pink-500 hover:border-pink-500/40 hover:shadow-[0_0_12px_rgba(244,63,94,0.35)]">
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}