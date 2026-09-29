interface AdminToastProps { message: string | null; }
export function AdminToast({ message }: AdminToastProps) {
  if (!message) return null;
  return <div role="status" aria-live="polite" className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] px-4 py-2.5 rounded-full bg-[#012d1d] text-white text-xs font-semibold shadow-xl flex items-center gap-2 border border-[#c1ecd4]/30 animate-in fade-in slide-in-from-bottom-2"><span className="material-symbols-outlined text-[18px] text-[#ffca98]">check_circle</span><span>{message}</span></div>;
}
