export function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-slate-950">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-100 border-t-blue-600 dark:border-slate-800 dark:border-t-pink-600" />
        <div className="h-6 w-6 animate-pulse rounded-full bg-gradient-to-r from-blue-600 to-pink-600" />
      </div>
      <span className="mt-4 text-xs font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase animate-pulse">
        Adl 5:8
      </span>
    </div>
  );
}