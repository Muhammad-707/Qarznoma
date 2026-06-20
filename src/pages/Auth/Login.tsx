import * as React from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLoginStore } from "@/store/AuthStore/LoginStore"
import { useFormik } from "formik"
import * as Yup from "yup"

export default function LogIn() {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = React.useState(false)
  const { login, isLoading, errorText, setErrorText } = useLoginStore()

  React.useEffect(() => {
    setErrorText(null)
  }, [setErrorText])

  const loginSchema = Yup.object().shape({
    email: Yup.string().email(t("auth.invalidEmail")).required(t("auth.emailRequired")),
    password: Yup.string().min(6, t("auth.passwordMin")).required(t("auth.passwordRequired")),
  })

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      login(values).catch(() => {})
    },
  })

  return (
    <div className="min-h-screen w-full flex bg-[#020208] overflow-hidden animate-in fade-in duration-700">
      <style>{`
        @keyframes laserScanFast {
          0% { top: -5%; opacity: 0; }
          10%, 90% { opacity: 1; }
          100% { top: 105%; opacity: 0; }
        }
        @keyframes statsFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes voiceWave {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1.3); }
        }
        .animate-laser-scan-fast {
          animation: laserScanFast 2.5s infinite linear;
        }
        .animate-voice-wave-1 { animation: voiceWave 1.1s infinite ease-in-out; transform-origin: center; }
        .animate-voice-wave-2 { animation: voiceWave 0.7s infinite ease-in-out 0.2s; transform-origin: center; }
        .animate-voice-wave-3 { animation: voiceWave 1.4s infinite ease-in-out 0.4s; transform-origin: center; }
        .animate-voice-wave-4 { animation: voiceWave 0.9s infinite ease-in-out 0.1s; transform-origin: center; }
        .animate-voice-wave-5 { animation: voiceWave 1.2s infinite ease-in-out 0.3s; transform-origin: center; }
      `}</style>
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#03030c] border-r border-indigo-950/40 p-12 flex-col justify-between overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-10 left-10 w-[250px] h-[250px] bg-cyan-500/5 blur-[90px] rounded-full pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-10 w-[250px] h-[250px] bg-pink-500/5 blur-[90px] rounded-full pointer-events-none -z-10" />
        <div 
          style={{
            backgroundImage: "radial-gradient(rgba(99, 102, 241, 0.05) 1.2px, transparent 1.2px)",
            backgroundSize: "24px 24px"
          }}
          className="absolute inset-0 opacity-80"
        />
        <Link to="/" className="flex items-center space-x-3 group z-10 self-start">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] via-[#8b5cf6] to-[#ec4899] text-white font-black text-lg shadow-sm">
            A
          </div>
          <span className="font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
            Ad1 
            <span className="bg-gradient-to-r from-[#3b82f6] to-[#ec4899] bg-clip-text text-transparent font-extrabold">
              5:8
            </span>
          </span>
        </Link>
        <div className="relative my-auto z-10 flex flex-col items-center justify-center w-full max-w-lg mx-auto py-10">
          <div className="relative h-48 w-44 sm:h-52 sm:w-52 rounded-full border border-indigo-500/10 flex items-center justify-center animate-[statsFloat_5s_infinite_ease-in-out]">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-500/20 animate-[spin_24s_infinite_linear]" />
            <div className="absolute inset-3 rounded-full border border-pink-500/30 border-t-pink-500 animate-[spin_12s_infinite_linear_reverse]" />
            <div className="absolute inset-6 rounded-full border-2 border-double border-cyan-400/40 border-b-cyan-400 animate-[spin_8s_infinite_linear]" />
            <div className="h-16 w-16 rounded-full bg-zinc-950 border border-white/10 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.25)] z-10">
              <svg viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 animate-pulse drop-shadow-[0_0_6px_#22d3ee]">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v12c0 3.5 8 5 8 5z" />
              </svg>
            </div>
          </div>
          <div className="absolute inset-0 flex flex-col justify-between w-full h-full pointer-events-none">
            <div className="flex justify-between items-start w-full">
              <div className="bg-zinc-950/60 border border-white/5 p-4 rounded-2xl flex flex-col items-center space-y-3 backdrop-blur-md relative overflow-hidden w-[150px]">
                <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest self-start">{t("auth.retinaScan")}</span>
                <div className="relative w-full h-14 flex items-center justify-center overflow-visible">
                  <svg viewBox="0 0 100 60" className="h-full w-full text-cyan-400 drop-shadow-[0_0_6px_#22d3ee] overflow-visible">
                    <circle cx="50" cy="30" r="24" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="4 4" className="animate-[spin_20s_infinite_linear]" />
                    <circle cx="50" cy="30" r="18" stroke="currentColor" strokeWidth="0.8" fill="none" />
                    <path d="M 20 30 Q 50 12 80 30 Q 50 48 20 30 Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    <circle cx="50" cy="30" r="8" stroke="currentColor" strokeWidth="1.2" fill="none" />
                    <circle cx="50" cy="30" r="3.5" fill="currentColor" />
                  </svg>
                  <div className="absolute left-0 right-0 h-[1.5px] bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-laser-scan-fast" />
                </div>
              </div>
              <div className="bg-zinc-950/60 border border-white/5 p-4 rounded-2xl flex flex-col items-center space-y-3 backdrop-blur-md relative overflow-hidden w-[150px]">
                <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest self-start">{t("auth.fingerprintId")}</span>
                <div className="relative w-full h-14 flex items-center justify-center overflow-visible">
                  {/* Идеально центрированный круглый отпечаток пальца в стиле Sci-Fi */}
                  <svg viewBox="0 0 100 60" className="h-full w-full text-emerald-400 drop-shadow-[0_0_8px_#10b981] overflow-visible" fill="none" stroke="currentColor" strokeLinecap="round">
                    <circle cx="50" cy="30" r="24" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="stroke-emerald-500/30 animate-[spin_20s_infinite_linear]" style={{ transformOrigin: '50px 30px' }} />
                    <circle cx="50" cy="30" r="26" stroke="currentColor" strokeWidth="0.5" className="stroke-emerald-500/10" />
                    <g strokeWidth="1.5" className="opacity-95 animate-pulse duration-1000" style={{ transformOrigin: '50px 30px' }}>
                      <path d="M 48,30 A 2,2 0 1,1 52,30 A 2,2 0 1,1 48,30" />
                      <path d="M 45,30 A 5,5 0 1,1 55,30 A 5,5 0 1,1 45,30" strokeDasharray="18 4 6 2" />
                      <path d="M 41,30 A 9,9 0 1,1 59,30 A 9,9 0 1,1 41,30" strokeDasharray="25 5 15 3" />
                      <path d="M 37,30 A 13,13 0 1,1 63,30 A 13,13 0 1,1 37,30" strokeDasharray="30 4 8 2 12 4" />
                      <path d="M 33,30 A 17,17 0 1,1 67,30 A 17,17 0 1,1 33,30" strokeDasharray="40 6 20 4" />
                      <path d="M 29,30 A 21,21 0 1,1 71,30 A 21,21 0 1,1 29,30" strokeDasharray="50 5 10 5" />
                      <path d="M 47,33 C 48,31 52,31 53,33" strokeWidth="1" />
                      <path d="M 49,30 L 49,27" strokeWidth="1.2" />
                    </g>
                  </svg>
                  <div className="absolute left-0 right-0 h-[1.5px] bg-emerald-500 shadow-[0_0_8px_#10b981] animate-laser-scan-fast" />
                </div>
              </div>
            </div>
            <div className="flex justify-between items-end w-full">
              <div className="bg-zinc-950/60 border border-white/5 p-4 rounded-2xl flex flex-col items-start space-y-2 backdrop-blur-md w-[150px]">
                <span className="text-[8px] font-black text-pink-500 uppercase tracking-widest">{t("auth.voiceprint")}</span>
                <div className="flex items-center justify-center gap-1.5 h-14 w-full pt-1 overflow-visible">
                  <span className="w-[3.5px] bg-pink-500 rounded-full h-3 animate-voice-wave-1 shadow-[0_0_8px_#ec4899]" />
                  <span className="w-[3.5px] bg-pink-500 rounded-full h-6 animate-voice-wave-2 shadow-[0_0_8px_#ec4899]" />
                  <span className="w-[3.5px] bg-pink-500 rounded-full h-9 animate-voice-wave-3 shadow-[0_0_8px_#ec4899]" />
                  <span className="w-[3.5px] bg-pink-500 rounded-full h-4 animate-voice-wave-4 shadow-[0_0_8px_#ec4899]" />
                  <span className="w-[3.5px] bg-pink-500 rounded-full h-11 animate-voice-wave-5 shadow-[0_0_8px_#ec4899]" />
                  <span className="w-[3.5px] bg-pink-500 rounded-full h-7 animate-voice-wave-1 shadow-[0_0_8px_#ec4899]" />
                </div>
              </div>
              <div className="bg-zinc-950/60 border border-white/5 p-4 rounded-2xl flex flex-col items-start space-y-2 backdrop-blur-md w-[150px] text-left">
                <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest">{t("auth.systemLogs")}</span>
                <div className="relative w-full h-14 flex items-center justify-center overflow-visible">
                  <svg viewBox="0 0 80 80" className="h-full w-full text-amber-500 drop-shadow-[0_0_6px_#f59e0b] overflow-visible">
                    <rect x="25" y="25" width="30" height="30" rx="6" stroke="currentColor" strokeWidth="1.8" fill="none" className="animate-pulse" />
                    <rect x="34" y="34" width="12" height="12" rx="3" fill="currentColor" className="animate-ping opacity-75 duration-1000" />
                    <rect x="35" y="35" width="10" height="10" rx="2" fill="currentColor" />
                    <line x1="10" y1="30" x2="25" y2="30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="10" y1="40" x2="25" y2="40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="10" y1="50" x2="25" y2="50" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="55" y1="30" x2="70" y2="30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="55" y1="40" x2="70" y2="40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="55" y1="50" x2="70" y2="50" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="35" y1="10" x2="35" y2="25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="45" y1="10" x2="45" y2="25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="35" y1="55" x2="35" y2="70" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="45" y1="55" x2="45" y2="70" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="10" cy="40" r="2.2" fill="currentColor" />
                    <circle cx="70" cy="40" r="2.2" fill="currentColor" />
                    <circle cx="45" cy="10" r="2.2" fill="currentColor" />
                    <circle cx="35" cy="70" r="2.2" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-left space-y-2 z-10 self-start max-w-sm">
          <h4 className="text-xl font-bold text-white tracking-tight">
            {t("auth.vaultTitle")}
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {t("auth.vaultDesc")}
          </p>
        </div>
      </div>
      <div className="flex-1 bg-background flex flex-col justify-center px-8 md:px-12 py-12 relative z-10 transition-colors duration-300">
        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="flex flex-col text-left space-y-2">
            <h2 className="text-3xl font-black text-foreground tracking-tight">
              {t("auth.loginTitle")}
            </h2>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              {t("auth.loginSubtitle")}
            </p>
          </div>
          <form onSubmit={formik.handleSubmit} className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-1.5 text-left">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 ml-1">
                {t("auth.email")}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-blue-500 transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  placeholder="john.doe@example.com"
                  className="h-11 w-full pl-10 pr-4 rounded-2xl border border-border bg-background/50 text-xs font-semibold text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              {formik.touched.email && formik.errors.email ? (
                <span className="text-[10px] text-rose-500 font-bold ml-1">{formik.errors.email}</span>
              ) : null}
            </div>
            <div className="flex flex-col space-y-1.5 text-left">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  {t("auth.password")}
                </label>
                <Link to="/forgot-password" className="text-[10px] font-bold text-indigo-500 hover:underline">
                  {t("auth.forgotPassword")}
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-blue-500 transition-colors">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  placeholder="••••••••"
                  className="h-11 w-full pl-10 pr-11 rounded-2xl border border-border bg-background/50 text-xs font-semibold text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground active:scale-95 transition-transform"
                >
                  {showPassword ? <Eye className="h-4 w-4 text-blue-500 animate-pulse" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <span className="text-[10px] text-rose-500 font-bold ml-1">{formik.errors.password}</span>
              ) : null}
            </div>
            {errorText && (
              <div className="text-xs font-semibold text-rose-500 text-left bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                {errorText}
              </div>
            )}
            <div className="flex items-center space-x-2.5 pt-1 text-left">
              <input
                type="checkbox"
                id="remember-me"
                className="h-4 w-4 rounded border-border bg-background text-indigo-500 focus:ring-indigo-500/30 cursor-pointer"
              />
              <label htmlFor="remember-me" className="text-[11px] text-muted-foreground font-semibold cursor-pointer select-none">
                {t("auth.rememberMe")}
              </label>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full h-11 bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white font-extrabold text-xs shadow-md border-0 transition-transform duration-300 hover:scale-[1.01]"
            >
              {isLoading ? t("auth.loggingIn") : t("auth.loginBtn")}
            </Button>
          </form>
          <div className="flex items-center justify-center space-x-1.5 text-xs text-muted-foreground">
            <span>{t("auth.noAccount")}</span>
            <Link to="/signup" className="font-extrabold text-indigo-500 hover:underline">
              {t("auth.signupLink")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}