import { FormEvent } from 'react';

interface AdminLoginProps {
  pin: string;
  hasError: boolean;
  onPinChange: (pin: string) => void;
  onSubmit: (event: FormEvent) => void;
  onQuickLogin: () => void;
  onExit: () => void;
}

export function AdminLogin({ pin, hasError, onPinChange, onSubmit, onQuickLogin, onExit }: AdminLoginProps) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#c1c8c2]/50 flex flex-col gap-6">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-16 h-16 rounded-2xl bg-[#012d1d] text-[#ffca98] flex items-center justify-center shadow-md"><span className="material-symbols-outlined text-[34px]">admin_panel_settings</span></div>
          <span className="font-label-sm text-xs font-bold text-[#7d562d] uppercase tracking-wider mt-2">Secrétariat & Rédaction</span>
          <h2 className="font-headline-sm text-2xl font-bold text-[#012d1d]">Espace Administration</h2>
          <p className="text-xs text-[#414844] max-w-xs leading-relaxed">Gestion éditoriale, publication des enseignements et chroniques de Nagréogo.</p>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="admin-pin" className="text-xs font-semibold text-[#012d1d] flex items-center justify-between"><span>Code d'accès administrateur</span><span className="text-[11px] text-[#717973] font-normal">Par défaut : 1234</span></label>
            <div className="relative">
              <input id="admin-pin" type="password" value={pin} onChange={(event) => onPinChange(event.target.value)} placeholder="Saisissez le code PIN..." className={`w-full h-12 px-4 rounded-xl border bg-[#f3fbf5] text-[#151d1a] font-medium text-sm focus:outline-none transition-colors ${hasError ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-[#c1c8c2] focus:border-[#012d1d] focus:ring-2 focus:ring-[#c1ecd4]'}`} autoFocus aria-invalid={hasError} aria-describedby={hasError ? 'admin-pin-error' : undefined} />
              <span className="absolute right-3.5 top-3.5 text-[#717973] material-symbols-outlined text-[20px]">lock</span>
            </div>
            {hasError && <span id="admin-pin-error" className="text-xs text-red-600 font-medium">Code incorrect. Utilisez le code par défaut : 1234 ou cliquez ci-dessous.</span>}
          </div>
          <button type="submit" className="w-full h-12 rounded-xl bg-[#012d1d] text-white font-label-md text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#1b4332] transition-colors shadow-sm active:scale-[0.98]"><span className="material-symbols-outlined text-[20px]">login</span><span>Déverrouiller l'administration</span></button>
        </form>
        <div className="pt-4 border-t border-[#e2eae4] flex flex-col gap-3">
          <button onClick={onQuickLogin} className="w-full py-2.5 px-4 rounded-xl bg-[#ffca98]/40 hover:bg-[#ffca98]/70 text-[#623f18] text-xs font-bold transition-colors flex items-center justify-center gap-2"><span className="material-symbols-outlined text-[18px]">verified_user</span><span>Accès rapide direct (Mode Démo)</span></button>
          <button onClick={onExit} className="text-xs text-[#717973] hover:text-[#012d1d] font-semibold text-center transition-colors">← Retour au site public</button>
        </div>
      </div>
    </div>
  );
}
