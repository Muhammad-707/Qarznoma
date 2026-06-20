import * as React from "react"
import { useTranslation } from "react-i18next"
import { Sparkles, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
export function Section4() {
  const { t } = useTranslation()
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 })
  const [isTransitioning, setIsTransitioning] = React.useState(true)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsTransitioning(false) 
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left - width / 2
    const mouseY = e.clientY - rect.top - height / 2
    const rotateX = -(mouseY / (height / 2)) * 10
    const rotateY = (mouseX / (width / 2)) * 10
    setTilt({ x: rotateX, y: rotateY })
  }
  const handleMouseLeave = () => {
    setIsTransitioning(true) 
    setTilt({ x: 0, y: 0 })
  }
  return (
    <section id="how-it-works" className="w-full bg-background py-16 sm:py-24 md:py-28 overflow-hidden">
      <div className="container px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-500 bg-blue-500/10 dark:bg-blue-500/15 px-4 py-1.5 rounded-full">
          {t("header.howItWorks")}
        </span>
        <h2 className="mt-4 text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-tight max-w-3xl">
          {t("section4.title")}
        </h2>
        <p className="mt-4 text-sm sm:text-lg text-muted-foreground font-normal max-w-xl">
          {t("section4.desc")}
        </p>
        <div className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 w-full">
          <div className="group relative rounded-2xl sm:rounded-3xl border border-[#e0e7ff] bg-[#f0f4ff]/50 p-4 sm:p-8 text-left transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:border-blue-500/30 hover:shadow-[0_15px_30px_rgba(37,99,235,0.06)] dark:border-indigo-950/50 dark:bg-indigo-950/5">
            <div className="text-2xl sm:text-4xl font-black text-blue-600 dark:text-blue-500 tracking-tight transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5">
              01
            </div>
            <h3 className="mt-4 sm:mt-6 text-sm sm:text-xl font-bold text-foreground">
              {t("section4.step1Title")}
            </h3>
            <p className="mt-1.5 sm:mt-3 text-[11px] sm:text-sm text-muted-foreground leading-relaxed">
              {t("section4.step1Desc")}
            </p>
          </div>
          <div className="group relative rounded-2xl sm:rounded-3xl border border-[#fef3c7] bg-[#fffbf0]/60 p-4 sm:p-8 text-left transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:border-amber-500/30 hover:shadow-[0_15px_30px_rgba(245,158,11,0.06)] dark:border-amber-950/50 dark:bg-amber-950/5">
            <div className="text-2xl sm:text-4xl font-black text-[#d97706] tracking-tight transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5">
              02
            </div>
            <h3 className="mt-4 sm:mt-6 text-sm sm:text-xl font-bold text-foreground">
              {t("section4.step2Title")}
            </h3>
            <p className="mt-1.5 sm:mt-3 text-[11px] sm:text-sm text-muted-foreground leading-relaxed">
              {t("section4.step2Desc")}
            </p>
          </div>
          <div className="group relative rounded-2xl sm:rounded-3xl border border-[#dcfce7] bg-[#f0fdf4]/60 p-4 sm:p-8 text-left transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:border-emerald-500/30 hover:shadow-[0_15px_30px_rgba(16,185,129,0.06)] dark:border-emerald-950/50 dark:bg-emerald-950/5">
            <div className="text-2xl sm:text-4xl font-black text-[#059669] tracking-tight transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5">
              03
            </div>
            <h3 className="mt-4 sm:mt-6 text-sm sm:text-xl font-bold text-foreground">
              {t("section4.step3Title")}
            </h3>
            <p className="mt-1.5 sm:mt-3 text-[11px] sm:text-sm text-muted-foreground leading-relaxed">
              {t("section4.step3Desc")}
            </p>
          </div>
          <div className="group relative rounded-2xl sm:rounded-3xl border border-[#f3e8ff] bg-[#faf5ff]/60 p-4 sm:p-8 text-left transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:border-purple-500/30 hover:shadow-[0_15px_30px_rgba(168,85,247,0.06)] dark:border-purple-950/50 dark:bg-purple-950/5">
            <div className="text-2xl sm:text-4xl font-black text-[#7c3aed] tracking-tight transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5">
              04
            </div>
            <h3 className="mt-4 sm:mt-6 text-sm sm:text-xl font-bold text-foreground">
              {t("section4.step4Title")}
            </h3>
            <p className="mt-1.5 sm:mt-3 text-[11px] sm:text-sm text-muted-foreground leading-relaxed">
              {t("section4.step4Desc")}
            </p>
          </div>
        </div>
        <div 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            backgroundImage: `
              radial-gradient(rgba(255, 255, 255, 0.15) 1.2px, transparent 1.2px), 
              linear-gradient(135deg, #1d4ed8 0%, #7c3aed 50%, #db2777 100%)
            `,
            backgroundSize: "18px 18px, 100% 100%",
            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: isTransitioning ? "all 0.5s ease" : "none"
          }}
          className="mt-16 w-full max-w-5xl rounded-[32px] sm:rounded-[40px] px-6 py-16 sm:px-12 sm:py-20 text-center text-white relative overflow-hidden cursor-pointer shadow-md transition-all duration-500 hover:shadow-[0_30px_60px_rgba(124,58,237,0.45)]"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-white/10 blur-[120px] rounded-full pointer-events-none -z-10" />
          <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {t("section4.ctaTitle")}
          </h3>
          <p className="mt-4 text-sm sm:text-base text-white/80 max-w-xl mx-auto leading-relaxed">
            {t("section4.ctaDesc")}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-3.5 w-full sm:w-auto">
            <Link to="/signup">
              <Button className="w-full sm:w-auto rounded-full px-8 py-6 text-sm font-bold text-indigo-700 bg-white hover:bg-white/95 hover:scale-[1.03] transition-all duration-300">
                {t("section4.ctaBtn")}
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="w-full sm:w-auto rounded-full px-8 py-6 text-sm font-bold text-white border-white/30 bg-white/10 hover:bg-white/20 hover:scale-[1.03] transition-all duration-300">
                {t("section4.ctaLogin")}
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center space-x-6 mt-10 text-white/80 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-white" /> {t("section1.badge1")}
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-white" /> {t("section1.badge2")}
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-white" /> {t("section1.badge3")}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}