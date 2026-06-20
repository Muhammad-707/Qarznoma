import * as React from "react"
import { useTranslation } from "react-i18next"
export function Section3() {
  const { t } = useTranslation()
  return (
    <section id="stats" className="w-full bg-background py-16 sm:py-20 overflow-hidden">
      <style>{`
        @keyframes statsLineFloat {
          0%, 100% { transform: translateY(0px) scaleY(1); }
          50% { transform: translateY(-3.5px) scaleY(0.94); }
        }
        @keyframes statsLineFlow {
          from { stroke-dashoffset: 36; }
          to { stroke-dashoffset: 0; }
        }
        .animate-line-float-1 { animation: statsLineFloat 3.4s infinite ease-in-out; }
        .animate-line-float-2 { animation: statsLineFloat 4.0s infinite ease-in-out; }
        .animate-line-float-3 { animation: statsLineFloat 3.0s infinite ease-in-out; }
        .animate-line-float-4 { animation: statsLineFloat 4.5s infinite ease-in-out; }
        .animate-line-flow {
          stroke-dasharray: 10 5;
          animation: statsLineFlow 2s infinite linear;
        }
      `}</style>
      <div className="container px-4 md:px-8 max-w-5xl mx-auto">
        <div className="relative border border-border/60 bg-background/50 backdrop-blur-md rounded-[32px] sm:rounded-[40px] p-8 sm:p-12 md:p-16 shadow-xl dark:bg-zinc-950/20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-[32px] sm:rounded-[40px] -z-10" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-6 md:gap-12 w-full">
            <svg className="absolute w-0 h-0">
              <defs>
                <linearGradient id="stats-spark-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
            <div className="flex flex-col items-start text-left group">
              <span className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-500 bg-clip-text text-transparent">
                10K+
              </span>
              <span className="text-xs sm:text-sm font-semibold text-muted-foreground mt-2">
                {t("section3.activeUsers")}
              </span>
              <div className="mt-4 w-full max-w-[140px] h-10 overflow-visible transition-transform duration-300 group-hover:scale-105">
                <svg viewBox="0 0 160 40" className="w-full h-full overflow-visible">
                  <path d="M 10 30 C 30 30, 40 20, 60 20 C 80 20, 90 25, 110 15 C 130 5, 140 10, 150 8" fill="none" stroke="url(#stats-spark-grad)" strokeWidth="2.5" strokeLinecap="round" className="animate-line-float-1 animate-line-flow" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col items-start text-left group">
              <span className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-500 bg-clip-text text-transparent">
                50K+
              </span>
              <span className="text-xs sm:text-sm font-semibold text-muted-foreground mt-2">
                {t("section3.debtsTracked")}
              </span>
              <div className="mt-4 w-full max-w-[140px] h-10 overflow-visible transition-transform duration-300 group-hover:scale-105">
                <svg viewBox="0 0 160 40" className="w-full h-full overflow-visible">
                  <path d="M 10 32 C 30 32, 45 15, 65 15 C 85 15, 100 28, 120 18 C 140 8, 145 12, 150 10" fill="none" stroke="url(#stats-spark-grad)" strokeWidth="2.5" strokeLinecap="round" className="animate-line-float-2 animate-line-flow" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col items-start text-left group">
              <span className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-500 bg-clip-text text-transparent">
                99.9%
              </span>
              <span className="text-xs sm:text-sm font-semibold text-muted-foreground mt-2">
                {t("section3.uptime")}
              </span>
              <div className="mt-4 w-full max-w-[140px] h-10 overflow-visible transition-transform duration-300 group-hover:scale-105">
                <svg viewBox="0 0 160 40" className="w-full h-full overflow-visible">
                  <path d="M 10 20 C 30 15, 50 25, 70 18 C 90 22, 110 18, 130 20 C 145 20, 150 20, 150 20" fill="none" stroke="url(#stats-spark-grad)" strokeWidth="2.5" strokeLinecap="round" className="animate-line-float-3 animate-line-flow" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col items-start text-left group">
              <span className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-500 bg-clip-text text-transparent">
                3
              </span>
              <span className="text-xs sm:text-sm font-semibold text-muted-foreground mt-2">
                {t("section3.languages")}
              </span>
              <div className="mt-4 w-full max-w-[140px] h-10 overflow-visible transition-transform duration-300 group-hover:scale-105">
                <svg viewBox="0 0 160 40" className="w-full h-full overflow-visible">
                  <path d="M 10 35 C 30 35, 40 35, 50 30 C 60 25, 70 20, 90 20 C 110 20, 120 15, 140 10 C 145 10, 150 10, 150 10" fill="none" stroke="url(#stats-spark-grad)" strokeWidth="2.5" strokeLinecap="round" className="animate-line-float-4 animate-line-flow" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}