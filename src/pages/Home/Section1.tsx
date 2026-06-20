import * as React from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Sparkles, ArrowRight, Wallet, TrendingUp, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
export function Section1() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = React.useState<"net" | "owes" | "owe">("net")
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
  let lineColor = "#3b82f6"
  let gradientId = "indigo-grad"
  let linePath = ""
  let areaPath = ""
  let glowClass = "from-blue-500/80 via-indigo-500/80 to-purple-500/80 shadow-[0_0_20px_rgba(59,130,246,0.6)]"
  let y0 = 0, y1 = 0, y2 = 0, y3 = 0, y4 = 0, y5 = 0
  let amt0 = "", amt1 = "", amt2 = "", amt3 = "", amt4 = "", amt5 = ""
  if (activeTab === "net") {
    lineColor = "#3b82f6"
    gradientId = "indigo-grad"
    glowClass = "from-blue-500/80 via-indigo-500/80 to-purple-500/80 shadow-[0_0_20px_rgba(59,130,246,0.6)]"
    y0 = 110; y1 = 90; y2 = 105; y3 = 75; y4 = 85; y5 = 50
    amt0 = "$3,100"; amt1 = "$3,520"; amt2 = "$3,300"; amt3 = "$4,120"; amt4 = "$3,900"; amt5 = "$4,470"
    linePath = "M 40 110 C 112 110, 112 90, 184 90 C 256 90, 256 105, 328 105 C 400 105, 400 75, 472 75 C 544 75, 544 85, 616 85 C 688 85, 688 50, 760 50"
    areaPath = "M 40 110 C 112 110, 112 90, 184 90 C 256 90, 256 105, 328 105 C 400 105, 400 75, 472 75 C 544 75, 544 85, 616 85 C 688 85, 688 50, 760 50 L 760 180 L 40 180 Z"
  } else if (activeTab === "owes") {
    lineColor = "#10b981"
    gradientId = "emerald-grad"
    glowClass = "from-teal-400/80 via-emerald-500/80 to-green-500/80 shadow-[0_0_20px_rgba(16,185,129,0.6)]"
    y0 = 100; y1 = 80; y2 = 95; y3 = 55; y4 = 65; y5 = 35
    amt0 = "$3,200"; amt1 = "$3,800"; amt2 = "$3,500"; amt3 = "$4,200"; amt4 = "$4,000"; amt5 = "$4,520"
    linePath = "M 40 100 C 112 100, 112 80, 184 80 C 256 80, 256 95, 328 95 C 400 95, 400 55, 472 55 C 544 55, 544 65, 616 65 C 688 65, 688 35, 760 35"
    areaPath = "M 40 100 C 112 100, 112 80, 184 80 C 256 80, 256 95, 328 95 C 400 95, 400 55, 472 55 C 544 55, 544 65, 616 65 C 688 65, 688 35, 760 35 L 760 180 L 40 180 Z"
  } else {
    lineColor = "#f43f5e"
    gradientId = "rose-grad"
    glowClass = "from-pink-500/80 via-rose-500/80 to-red-500/80 shadow-[0_0_20px_rgba(244,63,94,0.6)]"
    y0 = 140; y1 = 150; y2 = 120; y3 = 130; y4 = 135; y5 = 155
    amt0 = "$500"; amt1 = "$250"; amt2 = "$900"; amt3 = "$650"; amt4 = "$550"; amt5 = "$400"
    linePath = "M 40 140 C 112 140, 112 150, 184 150 C 256 150, 256 120, 328 120 C 400 120, 400 130, 472 130 C 544 130, 544 135, 616 135 C 688 135, 688 155, 760 155"
    areaPath = "M 40 140 C 112 140, 112 150, 184 150 C 256 150, 256 120, 328 120 C 400 120, 400 130, 472 130 C 544 130, 544 135, 616 135 C 688 135, 688 155, 760 155 L 760 180 L 40 180 Z"
  }
  let tooltipX = 0
  let tooltipY = 0
  let tooltipAmt = ""
  let tooltipMonth = ""
  if (hoveredIndex === 0) { tooltipX = 40; tooltipY = y0; tooltipAmt = amt0; tooltipMonth = "Jan" }
  else if (hoveredIndex === 1) { tooltipX = 184; tooltipY = y1; tooltipAmt = amt1; tooltipMonth = "Feb" }
  else if (hoveredIndex === 2) { tooltipX = 328; tooltipY = y2; tooltipAmt = amt2; tooltipMonth = "Mar" }
  else if (hoveredIndex === 3) { tooltipX = 472; tooltipY = y3; tooltipAmt = amt3; tooltipMonth = "Apr" }
  else if (hoveredIndex === 4) { tooltipX = 616; tooltipY = y4; tooltipAmt = amt4; tooltipMonth = "May" }
  else if (hoveredIndex === 5) { tooltipX = 760; tooltipY = y5; tooltipAmt = amt5; tooltipMonth = "Jun" }
  return (
    <section className="relative w-full overflow-hidden bg-background pt-16 pb-24 md:pt-24 md:pb-32">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] bg-gradient-to-tr from-indigo-500/10 to-pink-500/10 blur-[100px] rounded-full -z-10 pointer-events-none" />
      <div className="container px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-border bg-background/60 backdrop-blur-md text-xs font-semibold text-muted-foreground shadow-sm hover:scale-102 transition-transform duration-300">
          <Sparkles className="h-3.5 w-3.5 text-pink-500 animate-pulse" />
          <span>{t("section1.badge1")}</span>
          <span className="text-muted-foreground/40">•</span>
          <span>{t("section1.badge2")}</span>
          <span className="text-muted-foreground/40">•</span>
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">{t("section1.badge3")}</span>
        </div>
        <h1 className="mt-8 text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.08] max-w-4xl">
          <span className="bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] bg-clip-text text-transparent">
            {t("section1.title1")}
          </span>
          <br />
          <span className="block mt-2 text-foreground dark:text-white">
            {t("section1.title2")}
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground font-normal leading-relaxed">
          {t("section1.desc")}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 w-full sm:w-auto">
          <Link to="/login">
            <Button size="lg" className="w-full sm:w-auto rounded-full px-8 py-6 text-base font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_8px_25px_rgba(124,58,237,0.3)] bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] border-0 hover:opacity-95 shadow-md flex items-center justify-center hover:scale-105 transition-all">
              {t("section1.getStarted")}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-8 py-6 text-base font-semibold text-foreground transition-all duration-300 hover:scale-[1.03] bg-background/50 hover:bg-background border-border">
              {t("section1.createAccount")}
            </Button>
          </Link>
        </div>
        <div className="mt-16 w-full max-w-5xl bg-background/80 dark:bg-zinc-950/40 border border-border/60 rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl backdrop-blur-lg relative transition-all duration-500 overflow-hidden">
          <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl -z-10 opacity-70 blur-[1px]" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => setActiveTab("net")}
              className={`relative text-left p-6 rounded-2xl text-white transition-all duration-500 ease-out group cursor-pointer bg-gradient-to-r from-[#2563eb] via-[#3b82f6] to-[#6366f1] hover:-translate-y-2 hover:scale-[1.01] hover:shadow-[0_15px_30px_rgba(37,99,235,0.45)] ${activeTab === "net" ? "ring-2 ring-white/50 ring-offset-2 dark:ring-offset-zinc-950 scale-[1.01]" : ""}`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold tracking-wider uppercase text-white/90">
                  {t("section1.netTotal")}
                </span>
                <Wallet className="h-5 w-5 text-white/90" />
              </div>
              <div className="text-3xl font-bold tracking-tight text-white mb-3">$4,470</div>
              <div className={`absolute bottom-2.5 left-5 right-5 h-[4px] rounded-full bg-gradient-to-r from-[#38bdf8] via-sky-400 to-[#2563eb] transition-all duration-500 origin-center ${activeTab === "net" ? "scale-x-100 opacity-100 shadow-[0_0_12px_rgba(56,189,248,0.9)]" : "scale-x-50 opacity-0 group-hover:scale-x-100 group-hover:opacity-100 group-hover:shadow-[0_0_8px_rgba(255,255,255,0.4)]"}`} />
            </button>
            <button
              onClick={() => setActiveTab("owes")}
              className={`relative text-left p-6 rounded-2xl text-white transition-all duration-500 ease-out group cursor-pointer bg-gradient-to-r from-[#00b4d8] via-[#05c46b] to-[#0be881] hover:-translate-y-2 hover:scale-[1.01] hover:shadow-[0_15px_30px_rgba(5,196,107,0.45)] ${activeTab === "owes" ? "ring-2 ring-white/50 ring-offset-2 dark:ring-offset-zinc-950 scale-[1.01]" : ""}`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold tracking-wider uppercase text-white/90">
                  {t("section1.owesMe")}
                </span>
                <TrendingUp className="h-5 w-5 text-white/90" />
              </div>
              <div className="text-3xl font-bold tracking-tight text-white mb-3">$4,520</div>
              <div className={`absolute bottom-2.5 left-5 right-5 h-[4px] rounded-full bg-gradient-to-r from-[#00f5d4] via-emerald-400 to-[#10b981] transition-all duration-500 origin-center ${activeTab === "owes" ? "scale-x-100 opacity-100 shadow-[0_0_12px_rgba(0,245,212,0.9)]" : "scale-x-50 opacity-0 group-hover:scale-x-100 group-hover:opacity-100 group-hover:shadow-[0_0_8px_rgba(255,255,255,0.4)]"}`} />
            </button>
            <button
              onClick={() => setActiveTab("owe")}
              className={`relative text-left p-6 rounded-2xl text-white transition-all duration-500 ease-out group cursor-pointer bg-gradient-to-r from-[#ff007f] via-[#f43f5e] to-[#e11d48] hover:-translate-y-2 hover:scale-[1.01] hover:shadow-[0_15px_30px_rgba(244,63,94,0.45)] ${activeTab === "owe" ? "ring-2 ring-white/50 ring-offset-2 dark:ring-offset-zinc-950 scale-[1.01]" : ""}`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold tracking-wider uppercase text-white/90">
                  {t("section1.iOwe")}
                </span>
                <Wallet className="h-5 w-5 text-white/90" />
              </div>
              <div className="text-3xl font-bold tracking-tight text-white mb-3">$400</div>
              <div className={`absolute bottom-2.5 left-5 right-5 h-[4px] rounded-full bg-gradient-to-r from-[#ff2a6d] via-pink-400 to-[#f43f5e] transition-all duration-500 origin-center ${activeTab === "owe" ? "scale-x-100 opacity-100 shadow-[0_0_12px_rgba(255,42,109,0.9)]" : "scale-x-50 opacity-0 group-hover:scale-x-100 group-hover:opacity-100 group-hover:shadow-[0_0_8px_rgba(255,255,255,0.4)]"}`} />
            </button>
          </div>
          <div className="relative bg-muted/20 border border-border/40 rounded-2xl p-4 sm:p-6 text-left overflow-visible">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-base text-foreground tracking-tight flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {t("section1.chartTitle")}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">{t("section1.chartDesc")}</p>
              </div>
              <span className="text-xs font-semibold text-muted-foreground bg-muted/60 px-3 py-1 rounded-full border border-border/50">
                {t("section1.lastMonths")}
              </span>
            </div>
            <div className="relative w-full h-[180px] overflow-visible select-none">
              <svg 
                viewBox="0 0 800 180" 
                className="w-full h-full overflow-visible"
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <defs>
                  <linearGradient id="indigo-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.00" />
                  </linearGradient>
                  <linearGradient id="emerald-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.00" />
                  </linearGradient>
                  <linearGradient id="rose-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.00" />
                  </linearGradient>
                </defs>
                <line x1="40" y1="20" x2="760" y2="20" className="stroke-border/40" strokeDasharray="4 4" />
                <line x1="40" y1="90" x2="760" y2="90" className="stroke-border/40" strokeDasharray="4 4" />
                <line x1="40" y1="160" x2="760" y2="160" className="stroke-border/40" strokeDasharray="4 4" />
                <path d={areaPath} fill={`url(#${gradientId})`} className="transition-all duration-700 ease-in-out" />
                <path d={linePath} fill="none" stroke={lineColor} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-700 ease-in-out drop-shadow-[0_4px_10px_rgba(99,102,241,0.2)]" />
                {hoveredIndex !== null && (
                  <line
                    x1={hoveredIndex === 0 ? 40 : hoveredIndex === 1 ? 184 : hoveredIndex === 2 ? 328 : hoveredIndex === 3 ? 472 : hoveredIndex === 4 ? 616 : 760}
                    y1="10"
                    x2={hoveredIndex === 0 ? 40 : hoveredIndex === 1 ? 184 : hoveredIndex === 2 ? 328 : hoveredIndex === 3 ? 472 : hoveredIndex === 4 ? 616 : 760}
                    y2="170"
                    stroke={lineColor}
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    className="opacity-70 animate-fade-in"
                  />
                )}
                <g onMouseEnter={() => setHoveredIndex(0)} className="cursor-pointer">
                  <circle cx="40" cy={y0} r={hoveredIndex === 0 ? "6" : "4"} fill={lineColor} stroke="white" strokeWidth={hoveredIndex === 0 ? "2" : "1.5"} className="transition-all duration-200 dark:stroke-zinc-950" />
                  <circle cx="40" cy={y0} r="25" fill="transparent" />
                </g>
                <g onMouseEnter={() => setHoveredIndex(1)} className="cursor-pointer">
                  <circle cx="184" cy={y1} r={hoveredIndex === 1 ? "6" : "4"} fill={lineColor} stroke="white" strokeWidth={hoveredIndex === 1 ? "2" : "1.5"} className="transition-all duration-200 dark:stroke-zinc-950" />
                  <circle cx="184" cy={y1} r="25" fill="transparent" />
                </g>
                <g onMouseEnter={() => setHoveredIndex(2)} className="cursor-pointer">
                  <circle cx="328" cy={y2} r={hoveredIndex === 2 ? "6" : "4"} fill={lineColor} stroke="white" strokeWidth={hoveredIndex === 2 ? "2" : "1.5"} className="transition-all duration-200 dark:stroke-zinc-950" />
                  <circle cx="328" cy={y2} r="25" fill="transparent" />
                </g>
                <g onMouseEnter={() => setHoveredIndex(3)} className="cursor-pointer">
                  <circle cx="472" cy={y3} r={hoveredIndex === 3 ? "6" : "4"} fill={lineColor} stroke="white" strokeWidth={hoveredIndex === 3 ? "2" : "1.5"} className="transition-all duration-200 dark:stroke-zinc-950" />
                  <circle cx="472" cy={y3} r="25" fill="transparent" />
                </g>
                <g onMouseEnter={() => setHoveredIndex(4)} className="cursor-pointer">
                  <circle cx="616" cy={y4} r={hoveredIndex === 4 ? "6" : "4"} fill={lineColor} stroke="white" strokeWidth={hoveredIndex === 4 ? "2" : "1.5"} className="transition-all duration-200 dark:stroke-zinc-950" />
                  <circle cx="616" cy={y4} r="25" fill="transparent" />
                </g>
                <g onMouseEnter={() => setHoveredIndex(5)} className="cursor-pointer">
                  <circle cx="760" cy={y5} r={hoveredIndex === 5 ? "6" : "4"} fill={lineColor} stroke="white" strokeWidth={hoveredIndex === 5 ? "2" : "1.5"} className="transition-all duration-200 dark:stroke-zinc-950" />
                  <circle cx="760" cy={y5} r="25" fill="transparent" />
                </g>
              </svg>
              {hoveredIndex !== null && (
                <div
                  style={{
                    left: `${(tooltipX / 800) * 100}%`,
                    top: `${(tooltipY / 180) * 100 - 30}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-full bg-popover/95 border border-border px-3 py-1.5 rounded-xl shadow-xl backdrop-blur-md z-30 flex flex-col pointer-events-none animate-in fade-in zoom-in-95 duration-150 min-w-[70px] text-center"
                >
                  <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                    {tooltipMonth}
                  </span>
                  <span className="text-xs font-extrabold text-foreground mt-0.5">
                    {tooltipAmt}
                  </span>
                </div>
              )}
            </div>
            <div className="flex justify-between px-8 mt-4 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              <span className={`transition-colors duration-200 ${hoveredIndex === 0 ? "text-foreground font-extrabold" : ""}`}>Jan</span>
              <span className={`transition-colors duration-200 ${hoveredIndex === 1 ? "text-foreground font-extrabold" : ""}`}>Feb</span>
              <span className={`transition-colors duration-200 ${hoveredIndex === 2 ? "text-foreground font-extrabold" : ""}`}>Mar</span>
              <span className={`transition-colors duration-200 ${hoveredIndex === 3 ? "text-foreground font-extrabold" : ""}`}>Apr</span>
              <span className={`transition-colors duration-200 ${hoveredIndex === 4 ? "text-foreground font-extrabold" : ""}`}>May</span>
              <span className={`transition-colors duration-200 ${hoveredIndex === 5 ? "text-foreground font-extrabold" : ""}`}>Jun</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[4px] overflow-hidden">
            <div className={`w-full h-full bg-gradient-to-r transition-all duration-500 ease-out ${glowClass}`} />
          </div>
        </div>
      </div>
    </section>
  )
}