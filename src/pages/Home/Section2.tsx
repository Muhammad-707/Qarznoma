import * as React from "react"
import { useTranslation } from "react-i18next"
import { BookOpen, Users, WifiOff, BarChart3, Shield, Languages } from "lucide-react"
export function Section2() {
  const { t } = useTranslation()
  return (
    <section id="features" className="relative w-full bg-background py-16 sm:py-24 md:py-28 overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-gradient-to-r from-blue-500/5 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-l from-pink-500/5 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="container px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-500 bg-blue-500/10 dark:bg-blue-500/15 px-4 py-1.5 rounded-full">
          {t("header.features")}
        </span>
        <h2 className="mt-4 text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-tight max-w-3xl">
          {t("section2.title")}
        </h2>
        <p className="mt-4 text-sm sm:text-lg text-muted-foreground font-normal max-w-xl">
          {t("section2.desc")}
        </p>
        <div className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 w-full">
          <div className="group relative rounded-2xl sm:rounded-3xl border border-[#e0e7ff] bg-[#f0f4ff]/50 p-4 sm:p-8 text-left transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:border-indigo-500/40 hover:shadow-[0_20px_45px_rgba(99,102,241,0.12)] dark:border-indigo-950/60 dark:bg-indigo-950/10 dark:hover:border-indigo-500/30 overflow-hidden cursor-pointer">
            <div className="absolute -top-12 -right-12 h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-indigo-500/15 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-[#e0e7ff] text-[#3f51b5] transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 dark:bg-indigo-950/50 dark:text-indigo-400">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h3 className="mt-4 sm:mt-6 text-sm sm:text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              {t("section2.card1Title")}
            </h3>
            <p className="mt-1.5 sm:mt-3 text-[11px] sm:text-sm text-muted-foreground leading-relaxed">
              {t("section2.card1Desc")}
            </p>
          </div>
          <div className="group relative rounded-2xl sm:rounded-3xl border border-[#fef3c7] bg-[#fffbf0]/60 p-4 sm:p-8 text-left transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:border-amber-500/40 hover:shadow-[0_20px_45px_rgba(245,158,11,0.12)] dark:border-amber-950/60 dark:bg-amber-950/10 dark:hover:border-amber-500/30 overflow-hidden cursor-pointer">
            <div className="absolute -top-12 -right-12 h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-amber-500/15 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-[#fef3c7] text-[#d97706] transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 dark:bg-amber-950/50 dark:text-amber-400">
              <Users className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h3 className="mt-4 sm:mt-6 text-sm sm:text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-amber-600 dark:group-hover:text-amber-400">
              {t("section2.card2Title")}
            </h3>
            <p className="mt-1.5 sm:mt-3 text-[11px] sm:text-sm text-muted-foreground leading-relaxed">
              {t("section2.card2Desc")}
            </p>
          </div>
          <div className="group relative rounded-2xl sm:rounded-3xl border border-[#dcfce7] bg-[#f0fdf4]/60 p-4 sm:p-8 text-left transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:border-emerald-500/40 hover:shadow-[0_20px_45px_rgba(16,185,129,0.12)] dark:border-emerald-950/60 dark:bg-emerald-950/10 dark:hover:border-emerald-500/30 overflow-hidden cursor-pointer">
            <div className="absolute -top-12 -right-12 h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-emerald-500/15 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-[#dcfce7] text-[#059669] transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 dark:bg-emerald-950/50 dark:text-emerald-400">
              <WifiOff className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h3 className="mt-4 sm:mt-6 text-sm sm:text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
              {t("section2.card3Title")}
            </h3>
            <p className="mt-1.5 sm:mt-3 text-[11px] sm:text-sm text-muted-foreground leading-relaxed">
              {t("section2.card3Desc")}
            </p>
          </div>
          <div className="group relative rounded-2xl sm:rounded-3xl border border-[#f3e8ff] bg-[#faf5ff]/60 p-4 sm:p-8 text-left transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:border-purple-500/40 hover:shadow-[0_20px_45px_rgba(168,85,247,0.12)] dark:border-purple-950/60 dark:bg-purple-950/10 dark:hover:border-purple-500/30 overflow-hidden cursor-pointer">
            <div className="absolute -top-12 -right-12 h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-purple-500/15 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-[#f3e8ff] text-[#7c3aed] transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 dark:bg-purple-950/50 dark:text-purple-400">
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h3 className="mt-4 sm:mt-6 text-sm sm:text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">
              {t("section2.card4Title")}
            </h3>
            <p className="mt-1.5 sm:mt-3 text-[11px] sm:text-sm text-muted-foreground leading-relaxed">
              {t("section2.card4Desc")}
            </p>
          </div>
          <div className="group relative rounded-2xl sm:rounded-3xl border border-[#ffe4e6] bg-[#fff5f5]/60 p-4 sm:p-8 text-left transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:border-rose-500/40 hover:shadow-[0_20px_45px_rgba(244,63,94,0.12)] dark:border-rose-950/60 dark:bg-rose-950/10 dark:hover:border-rose-500/30 overflow-hidden cursor-pointer">
            <div className="absolute -top-12 -right-12 h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-rose-500/15 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-[#ffe4e6] text-[#e11d48] transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 dark:bg-rose-950/50 dark:text-rose-400">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h3 className="mt-4 sm:mt-6 text-sm sm:text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-rose-600 dark:group-hover:text-rose-400">
              {t("section2.card5Title")}
            </h3>
            <p className="mt-1.5 sm:mt-3 text-[11px] sm:text-sm text-muted-foreground leading-relaxed">
              {t("section2.card5Desc")}
            </p>
          </div>
          <div className="group relative rounded-2xl sm:rounded-3xl border border-[#e0f2fe] bg-[#f0f9ff]/60 p-4 sm:p-8 text-left transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:border-sky-500/40 hover:shadow-[0_20px_45px_rgba(14,165,233,0.12)] dark:border-sky-950/60 dark:bg-sky-950/10 dark:hover:border-sky-500/30 overflow-hidden cursor-pointer">
            <div className="absolute -top-12 -right-12 h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-sky-500/15 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-[#e0f2fe] text-[#0284c7] transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 dark:bg-sky-950/50 dark:text-sky-400">
              <Languages className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h3 className="mt-4 sm:mt-6 text-sm sm:text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-sky-600 dark:group-hover:text-sky-400">
              {t("section2.card6Title")}
            </h3>
            <p className="mt-1.5 sm:mt-3 text-[11px] sm:text-sm text-muted-foreground leading-relaxed">
              {t("section2.card6Desc")}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}