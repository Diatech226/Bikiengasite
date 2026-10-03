import { FormEvent } from 'react';

interface Props {
  email: string;
  password: string;
  hasError: boolean;
  loading: boolean;
  errorMessage?: string;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
  onExit: () => void;
}

export function AdminLogin({
  email,
  password,
  hasError,
  loading,
  errorMessage,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onExit,
}: Props) {
  const fillDemoCredentials = () => {
    onEmailChange('admin@nagreogo.bf');
    onPasswordChange('admin123');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#c1c8c2]/50 flex flex-col gap-6">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-16 h-16 rounded-2xl bg-[#012d1d] text-[#ffca98] flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-[34px]">admin_panel_settings</span>
          </div>
          <span className="font-label-sm text-xs font-bold text-[#7d562d] uppercase tracking-wider mt-2">
            Secrétariat & Rédaction
          </span>
          <h2 className="font-headline-sm text-2xl font-bold text-[#012d1d]">Espace Administration</h2>
          <p className="text-xs text-[#414844]">Connectez-vous pour gérer les articles du blog, les dons et les contenus.</p>
        </div>

        {/* Demo credentials banner */}
        <div className="bg-[#f0f7f3] border border-[#c1ecd4] rounded-2xl p-3 text-xs text-[#012d1d] flex items-center justify-between gap-2">
          <div>
            <p className="font-semibold text-[11px] text-[#00452e]">Accès rapide secrétariat</p>
            <p className="text-[11px] text-[#414844]">admin@nagreogo.bf • admin123</p>
          </div>
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="px-2.5 py-1 bg-[#012d1d] text-white rounded-lg text-[11px] font-semibold hover:bg-[#00452e] transition-colors"
          >
            Remplir
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <label className="text-xs font-semibold text-[#012d1d]">
            Adresse e-mail
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="admin@nagreogo.bf"
              className="mt-1.5 w-full h-12 px-4 rounded-xl border border-[#c1c8c2] bg-[#f3fbf5] text-sm"
            />
          </label>
          <label className="text-xs font-semibold text-[#012d1d]">
            Mot de passe
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="••••••••"
              className={`mt-1.5 w-full h-12 px-4 rounded-xl border bg-[#f3fbf5] text-sm ${
                hasError ? 'border-red-500' : 'border-[#c1c8c2]'
              }`}
            />
          </label>
          {hasError && <span className="text-xs text-red-600 font-medium">{errorMessage || 'Connexion impossible.'}</span>}
          <button
            disabled={loading}
            type="submit"
            className="w-full h-12 rounded-xl bg-[#012d1d] disabled:opacity-60 text-white text-sm font-bold hover:bg-[#00452e] transition-colors"
          >
            {loading ? 'Connexion…' : 'Se connecter à l’administration'}
          </button>
        </form>

        <button onClick={onExit} className="text-xs text-[#717973] font-semibold text-center hover:text-[#012d1d]">
          ← Retour au site public
        </button>
      </div>
    </div>
  );
}

