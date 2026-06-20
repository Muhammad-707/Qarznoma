import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 px-4 text-center relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-pink-500/10 dark:bg-pink-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full p-8 rounded-3xl border border-slate-100 dark:border-slate-900 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md shadow-2xl relative z-10">
        <div className="text-9xl font-black tracking-tighter bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent select-none animate-pulse">
          404
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-6 mb-2">
          Page Not Found
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
          The link you followed may be broken, or the page may have been removed or renamed within the ledger system.
        </p>
        <Link
          to="/"
          className="inline-flex w-full items-center justify-center h-11 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white text-sm font-medium shadow-lg shadow-blue-500/20 dark:shadow-pink-500/10 transition-all duration-300">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}