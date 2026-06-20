import * as React from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock,
  Calendar
} from "lucide-react"
import { useDashboardStore } from "@/store/DashboardStore"
import { AddDebtModal } from "@/pages/Dashboard/AddDeptModal"
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
export default function Dashboard() {
  const { t } = useTranslation()
  const { summary, debts, isLoading, fetchDashboardData } = useDashboardStore()
  const [selectedYear, setSelectedYear] = React.useState<number>(2026)
  const [zoom, setZoom] = React.useState<number>(1)
  const [panOffset, setPanOffset] = React.useState<number>(0)
  const [isDragging, setIsDragging] = React.useState(false)
  const [startX, setStartX] = React.useState(0)
  const [activeTab, setActiveTab] = React.useState<"net" | "owes" | "owe">("net")
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
  const [isFabOpen, setIsFabOpen] = React.useState(false)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [modalDirection, setModalDirection] = React.useState<string>("they_owe_me")
  const [toast, setToast] = React.useState<string | null>(null)
  const [isMobile, setIsMobile] = React.useState(false)
  const svgRef = React.useRef<SVGSVGElement | null>(null)
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])
  React.useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])
  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 4000)
  }
  const formatDate = (isoString: string) => {
    if (!isoString) return ""
    const date = new Date(isoString)
    return date.toLocaleDateString("en-US", { month: "short", day: "2-digit" })
  }
  const netTotalVal = summary?.outstanding?.net_balance !== undefined ? Number(summary.outstanding.net_balance) : 0
  const owesMeVal = summary?.outstanding?.they_owe_me !== undefined ? Number(summary.outstanding.they_owe_me) : 0
  const iOweVal = summary?.outstanding?.i_owe_them !== undefined ? Number(summary.outstanding.i_owe_them) : 0
  const chartData = React.useMemo(() => {
    const monthlySum = Array.from({ length: 12 }, (_, i) => ({
      monthName: MONTHS[i],
      owesMe: 0,
      iOwe: 0
    }))
    debts.forEach((debt) => {
      const date = new Date(debt.due_date || debt.created_at)
      if (date.getFullYear() === selectedYear) {
        const monthIndex = date.getMonth()
        const amount = Number(debt.amount) || 0
        if (debt.direction === "they_owe_me") {
          monthlySum[monthIndex].owesMe += amount
        } else {
          monthlySum[monthIndex].iOwe += amount
        }
      }
    })
    return monthlySum
  }, [debts, selectedYear])
  const maxChartVal = React.useMemo(() => {
    const vals = chartData.flatMap(m => [m.owesMe, m.iOwe])
    return Math.max(...vals, 100)
  }, [chartData])
  const svgHeight = isMobile ? 550 : 240
  const baselineY = isMobile ? 470 : 190
  const verticalMultiplier = isMobile ? 400 : 145
  const getY = (val: number) => baselineY - (val / maxChartVal) * verticalMultiplier
  const owesMePoints = chartData.map((d, i) => {
    const x = 40 + (i / 11) * 720
    const y = getY(d.owesMe)
    return `${x},${y}`
  }).join(" ")
  const iOwePoints = chartData.map((d, i) => {
    const x = 40 + (i / 11) * 720
    const y = getY(d.iOwe)
    return `${x},${y}`
  }).join(" ")
  const owesMeArea = `40,${baselineY} ${owesMePoints} 760,${baselineY}`
  const iOweArea = `40,${baselineY} ${iOwePoints} 760,${baselineY}`
  const handleDragStart = (clientX: number) => {
    if (zoom <= 1) return
    setIsDragging(true)
    setStartX(clientX)
  }
  const handleDragMove = (clientX: number) => {
    if (!isDragging || !svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const svgWidth = rect.width
    const ratio = (800 / zoom) / svgWidth
    const dx = (startX - clientX) * ratio
    const maxOffset = 800 - 800 / zoom
    setPanOffset(prev => Math.max(0, Math.min(prev + dx, maxOffset)))
    setStartX(clientX)
  }
  const handleDragEnd = () => {
    setIsDragging(false)
  }
  const activeX = hoveredIndex !== null ? 40 + (hoveredIndex / 11) * 720 : 0
  const activeTooltipData = hoveredIndex !== null ? chartData[hoveredIndex] : null
  const tooltipLeftPercent = hoveredIndex !== null ? ((activeX - panOffset) / (800 / zoom)) * 100 : 0
  const isTooltipVisible = hoveredIndex !== null && activeTooltipData && tooltipLeftPercent >= 0 && tooltipLeftPercent <= 100
  const openAddDebtModal = (dir: string) => {
    setModalDirection(dir)
    setIsModalOpen(true)
    setIsFabOpen(false)
  }
  return (
    <div className="w-full flex flex-col space-y-8 animate-in fade-in duration-500 relative max-w-7xl mx-auto px-4 sm:px-6 pb-36 lg:pb-24 select-none">
      <style>{`
        @keyframes skeletonShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%);
          background-size: 200% 100%;
          animation: skeletonShimmer 1.5s infinite linear;
        }
      `}</style>
      {isLoading && !summary ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 select-none">
          <div className="col-span-2 md:col-span-1 relative p-6 md:p-8 h-32 md:h-48 rounded-[24px] md:rounded-[32px] border border-border/85 bg-zinc-900/30 overflow-hidden flex flex-col justify-between animate-pulse">
            <div className="absolute inset-0 animate-shimmer" />
            <div className="h-4 w-20 bg-muted/80 rounded-md" />
            <div className="h-10 w-32 bg-muted/80 rounded-xl" />
          </div>
          <div className="col-span-1 relative p-4 md:p-8 h-32 md:h-48 rounded-[24px] md:rounded-[32px] border border-border/85 bg-zinc-900/30 overflow-hidden flex flex-col justify-between animate-pulse">
            <div className="absolute inset-0 animate-shimmer" />
            <div className="h-4 w-20 bg-muted/80 rounded-md" />
            <div className="h-10 w-24 bg-muted/80 rounded-xl" />
          </div>
          <div className="col-span-1 relative p-4 md:p-8 h-32 md:h-48 rounded-[24px] md:rounded-[32px] border border-border/85 bg-zinc-900/30 overflow-hidden flex flex-col justify-between animate-pulse">
            <div className="absolute inset-0 animate-shimmer" />
            <div className="h-4 w-20 bg-muted/80 rounded-md" />
            <div className="h-10 w-24 bg-muted/80 rounded-xl" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <button
            onClick={() => setActiveTab("net")}
            className={`col-span-2 md:col-span-1 w-full relative text-left p-6 md:p-8 h-32 md:h-48 rounded-[24px] md:rounded-[32px] text-white transition-all duration-500 ease-out group overflow-hidden cursor-pointer bg-gradient-to-br from-[#2563eb] via-[#3b82f6] to-[#6366f1] hover:-translate-y-2 hover:scale-[1.01] hover:shadow-[0_25px_50px_rgba(37,99,235,0.45)] ${activeTab === "net" ? "ring-2 ring-white/50 ring-offset-2 dark:ring-offset-zinc-950 scale-[1.01]" : ""}`}
          >
            <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transition-all duration-1000 group-hover:left-[150%] pointer-events-none" />
            <div className="flex justify-between items-start mb-2 md:mb-4">
              <span className="text-[10px] md:text-xs font-black tracking-wider uppercase text-white/90">{t("section1.netTotal")}</span>
              <Wallet className="h-5 w-5 md:h-7 md:w-7 text-white/90 transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div className="text-3xl md:text-5xl font-black text-white tracking-tight mb-1 md:mb-2">${Math.abs(netTotalVal)}</div>
            <div className="text-[10px] md:text-[11px] text-white/70 font-bold">{t("dashboard.netBalanceDesc")}</div>
          </button>
          <button
            onClick={() => setActiveTab("owes")}
            className={`col-span-1 w-full relative text-left p-4 md:p-8 h-32 md:h-48 rounded-[24px] md:rounded-[32px] text-white transition-all duration-500 ease-out group overflow-hidden cursor-pointer bg-gradient-to-br from-[#00b4d8] via-[#05c46b] to-[#0be881] hover:-translate-y-2 hover:scale-[1.01] hover:shadow-[0_25px_50px_rgba(5,196,107,0.45)] ${activeTab === "owes" ? "ring-2 ring-white/50 ring-offset-2 dark:ring-offset-zinc-950 scale-[1.01]" : ""}`}
          >
            <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transition-all duration-1000 group-hover:left-[150%] pointer-events-none" />
            <div className="flex justify-between items-start mb-2 md:mb-4">
              <span className="text-[10px] md:text-xs font-black tracking-wider uppercase text-white/90">{t("section1.owesMe")}</span>
              <TrendingUp className="h-5 w-5 md:h-7 md:w-7 text-white/90 transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div className="text-2xl md:text-5xl font-black text-white tracking-tight mb-1 md:mb-2">${owesMeVal}</div>
            <div className="text-[10px] md:text-[11px] text-white/70 font-bold">{t("dashboard.incoming")}</div>
          </button>
          <button
            onClick={() => setActiveTab("owe")}
            className={`col-span-1 w-full relative text-left p-4 md:p-8 h-32 md:h-48 rounded-[24px] md:rounded-[32px] text-white transition-all duration-500 ease-out group overflow-hidden cursor-pointer bg-gradient-to-br from-[#ff007f] via-[#f43f5e] to-[#e11d48] hover:-translate-y-2 hover:scale-[1.01] hover:shadow-[0_25px_50px_rgba(244,63,94,0.45)] ${activeTab === "owe" ? "ring-2 ring-white/50 ring-offset-2 dark:ring-offset-zinc-950 scale-[1.01]" : ""}`}
          >
            <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transition-all duration-1000 group-hover:left-[150%] pointer-events-none" />
            <div className="flex justify-between items-start mb-2 md:mb-4">
              <span className="text-[10px] md:text-xs font-black tracking-wider uppercase text-white/95">{t("section1.iOwe")}</span>
              <TrendingDown className="h-5 w-5 md:h-7 md:w-7 text-white/95 transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div className="text-2xl md:text-5xl font-black text-white tracking-tight mb-1 md:mb-2">${iOweVal}</div>
            <div className="text-[10px] md:text-[11px] text-white/70 font-bold">{t("dashboard.outgoing")}</div>
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
        <div className="lg:col-span-2 border border-border/50 bg-background/55 backdrop-blur-md rounded-[32px] p-6 text-left relative overflow-hidden flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <div>
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {t("dashboard.chartTitle")}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">{t("dashboard.chartDesc")}</p>
            </div>
            <div className="flex items-center space-x-2.5">
              <div className="flex items-center bg-muted/40 px-3 py-1.5 rounded-xl border border-border/60 space-x-2">
                <span className="text-[9px] font-black text-muted-foreground uppercase">{t("dashboard.zoom")}</span>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => {
                    const newZoom = Number(e.target.value)
                    setZoom(newZoom)
                    const maxOffset = 800 - 800 / newZoom
                    setPanOffset(prev => Math.min(prev, maxOffset))
                  }}
                  className="w-16 sm:w-24 h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
                />
                <span className="text-[10px] font-black text-indigo-500 min-w-[28px] text-center select-none">
                  {zoom.toFixed(1)}x
                </span>
                {zoom > 1 && (
                  <button
                    onClick={() => {
                      setZoom(1)
                      setPanOffset(0)
                    }}
                    className="text-[9px] font-black text-rose-500 hover:text-rose-600 uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-500/10"
                  >
                    {t("dashboard.reset")}
                  </button>
                )}
              </div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="h-8.5 px-2.5 rounded-lg border border-border bg-background/50 text-[11px] font-black focus:outline-none"
              >
                <option value={2026}>{t("dashboard.yearPill", { year: 2026 })}</option>
                <option value={2025}>{t("dashboard.yearPill", { year: 2025 })}</option>
                <option value={2024}>{t("dashboard.yearPill", { year: 2024 })}</option>
              </select>
            </div>
          </div>
          {zoom > 1 && (
            <div className="text-[9px] font-black uppercase text-indigo-500 bg-indigo-500/10 border border-indigo-500/25 px-2.5 py-1 rounded-md self-start animate-in fade-in duration-200 mt-2">
              {t("dashboard.panInstruction")}
            </div>
          )}
          <div className="relative w-full h-[280px] sm:h-[320px] md:h-[340px] overflow-visible select-none mt-6">
            <svg 
              ref={svgRef}
              viewBox={`${panOffset} 0 ${800 / zoom} ${svgHeight}`} 
              className="w-full h-full overflow-visible" 
              onMouseDown={(e) => handleDragStart(e.clientX)}
              onMouseMove={(e) => handleDragMove(e.clientX)}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={(e) => e.touches.length > 0 && handleDragStart(e.touches[0].clientX)}
              onTouchMove={(e) => e.touches.length > 0 && handleDragMove(e.touches[0].clientX)}
              onTouchEnd={handleDragEnd}
            >
              <defs>
                <linearGradient id="indigo-grad-dash-2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="rose-grad-dash-2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <line x1="0" y1={isMobile ? 70 : 45} x2="800" y2={isMobile ? 70 : 45} className="stroke-border/40" strokeDasharray="4 4" />
              <line x1="0" y1={isMobile ? 270 : 115} x2="800" y2={isMobile ? 270 : 115} className="stroke-border/40" strokeDasharray="4 4" />
              <line x1="0" y1={baselineY} x2="800" y2={baselineY} className="stroke-border/40" strokeDasharray="4 4" />
              {(activeTab === "net" || activeTab === "owes") && (
                <>
                  <polygon points={owesMeArea} fill="url(#indigo-grad-dash-2)" className="transition-all duration-500" />
                  <polyline points={owesMePoints} fill="none" stroke="#3b82f6" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-500" />
                </>
              )}
              {(activeTab === "net" || activeTab === "owe") && (
                <>
                  <polygon points={iOweArea} fill="url(#rose-grad-dash-2)" className="transition-all duration-500" />
                  <polyline points={iOwePoints} fill="none" stroke="#ec4899" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-500" />
                </>
              )}
              {hoveredIndex !== null && (
                <line
                  x1={activeX}
                  y1="15"
                  x2={activeX}
                  y2={baselineY + 5}
                  stroke="#94a3b8"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                />
              )}
              {chartData.map((_, i) => {
                const x = 40 + (i / 11) * 720
                return (
                  <g key={i} onMouseEnter={() => setHoveredIndex(i)} className="cursor-pointer">
                    <rect x={x - 25} y="10" width="50" height={svgHeight - 40} fill="transparent" />
                    {hoveredIndex === i && (
                      <>
                        {(activeTab === "net" || activeTab === "owes") && (
                          <circle cx={x} cy={getY(chartData[i].owesMe)} r="5.5" fill="#3b82f6" stroke="white" strokeWidth="1.5" />
                        )}
                        {(activeTab === "net" || activeTab === "owe") && (
                          <circle cx={x} cy={getY(chartData[i].iOwe)} r="5.5" fill="#ec4899" stroke="white" strokeWidth="1.5" />
                        )}
                      </>
                    )}
                  </g>
                )
              })}
              {chartData.map((d, i) => {
                const x = 40 + (i / 11) * 720
                return (
                  <text
                    key={i}
                    x={x}
                    y={isMobile ? 515 : 225}
                    textAnchor="middle"
                    className="fill-muted-foreground/90 dark:fill-muted-foreground/70 text-[11px] md:text-[13px] font-black select-none"
                  >
                    {d.monthName}
                  </text>
                )
              })}
            </svg>
            {isTooltipVisible && activeTooltipData && (
              <div
                style={{
                  left: `${tooltipLeftPercent}%`,
                  top: `35%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-full bg-white text-zinc-950 border border-zinc-200/80 px-4 py-2.5 rounded-2xl shadow-2xl z-30 flex flex-col pointer-events-none min-w-[120px] text-left animate-in fade-in-50 zoom-in-95"
              >
                <span className="text-[10px] uppercase tracking-widest font-black text-zinc-400">
                  {activeTooltipData.monthName} ({selectedYear})
                </span>
                {(activeTab === "net" || activeTab === "owes") && (
                  <span className="text-xs font-bold text-blue-500 mt-1 animate-in fade-in-50">
                    {t("section1.owesMe")}: ${activeTooltipData.owesMe}
                  </span>
                )}
                {(activeTab === "net" || activeTab === "owe") && (
                  <span className="text-xs font-bold text-pink-500 mt-0.5 animate-in fade-in-50">
                    {t("section1.iOwe")}: ${activeTooltipData.iOwe}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="border border-border/50 bg-background/55 backdrop-blur-md rounded-[32px] p-6 text-left relative flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="font-bold text-base text-foreground">{t("dashboard.upcomingDue")}</h3>
            <div className="mt-4 flex flex-col space-y-3.5 max-h-[350px] overflow-y-auto pr-1 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {summary?.upcoming_due && summary.upcoming_due.length > 0 ? (
                summary.upcoming_due.map((due: any, i: number) => {
                  const matchedDebt = debts.find((d: any) => d.id === due.id)
                  const debtTitle = matchedDebt?.description || "Debt Payment"
                  return (
                    <Link 
                      to={`/debts?debt_id=${due.id}`}
                      key={i} 
                      className="flex items-center justify-between p-4 border border-border/40 rounded-2xl bg-muted/5 hover:border-indigo-500/20 hover:scale-[1.01] transition-all duration-300"
                    >
                      <div className="flex items-center space-x-3.5">
                        {due.direction === "they_owe_me" ? (
                          <div className="h-9 w-9 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.25)]">
                            <ArrowDownLeft className="h-4.5 w-4.5" />
                          </div>
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-rose-500/15 border border-rose-500/20 text-rose-500 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.25)]">
                            <ArrowUpRight className="h-4.5 w-4.5" />
                          </div>
                        )}
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-black text-foreground truncate max-w-[120px]">
                            {debtTitle}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-semibold mt-1">
                            {due.contact_name} • {formatDate(due.due_date).split(",")[0]}
                          </span>
                        </div>
                      </div>
                      <span className={`text-sm font-black ${due.direction === "they_owe_me" ? "text-emerald-500" : "text-rose-500"}`}>
                        {due.direction === "they_owe_me" ? "+" : "-"}${due.amount}
                      </span>
                    </Link>
                  )
                })
              ) : (
                <div className="text-xs font-semibold text-muted-foreground p-6 text-center">
                  {t("dashboard.noUpcoming")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div 
        onMouseEnter={() => setIsFabOpen(true)}
        onMouseLeave={() => setIsFabOpen(false)}
        className="fixed bottom-24 right-6 lg:bottom-8 lg:right-8 flex flex-col items-end space-y-3 z-40 transition-all duration-300"
      >
        <div className={`flex flex-col items-end space-y-2.5 transition-all duration-300 origin-bottom ${isFabOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-75 translate-y-4 pointer-events-none"}`}>
          <button 
            onClick={() => openAddDebtModal("i_owe_them")}
            className="flex items-center space-x-2 bg-background border border-border/80 px-3.5 py-2 rounded-full shadow-md active:scale-95 transition-transform"
          >
            <span className="text-xs font-bold text-foreground">{t("section1.iOwe")}</span>
            <div className="h-7 w-7 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-sm">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </button>
          <button 
            onClick={() => openAddDebtModal("they_owe_me")}
            className="flex items-center space-x-2 bg-background border border-border/80 px-3.5 py-2 rounded-full shadow-md active:scale-95 transition-transform"
          >
            <span className="text-xs font-bold text-foreground">{t("section1.owesMe")}</span>
            <div className="h-7 w-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
              <ArrowDownLeft className="h-4 w-4" />
            </div>
          </button>
        </div>
        <button
          onClick={() => setIsFabOpen(!isFabOpen)}
          className="h-14 w-14 rounded-full flex items-center justify-center text-white bg-gradient-to-r from-blue-500 to-purple-600 border-0 shadow-xl active:scale-95 hover:scale-105 transition-all"
        >
          <Plus className={`h-7 w-7 transition-all duration-300 ${isFabOpen ? "rotate-45" : "rotate-0"}`} />
        </button>
      </div>
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] border border-white/20 px-5 py-3.5 shadow-2xl flex items-center gap-3 rounded-2xl animate-in slide-in-from-top-5 duration-300">
          <span className="h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-pulse" />
          <span className="text-xs font-bold text-white tracking-wide">{toast}</span>
        </div>
      )}
      <AddDebtModal 
        isOpen={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        defaultDirection={modalDirection} 
        onSuccess={(msg) => showToast(msg)}
      />
    </div>
  )
}