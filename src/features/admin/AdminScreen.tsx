import { FormEvent, useCallback, useEffect, useState } from 'react';
import { authApi } from '../../services/authApi';
import { DashboardStats, dashboardApi } from '../../services/dashboardApi';
import { ArticleItem } from '../../types';
import { useToast } from '../../hooks/useToast';
import { AdminArticles } from './components/AdminArticles';
import { AdminCategories } from './components/AdminCategories';
import { AdminContacts } from './components/AdminContacts';
import { AdminDonations } from './components/AdminDonations';
import { AdminLogin } from './components/AdminLogin';
import { AdminOverview } from './components/AdminOverview';
import { AdminToast } from './components/AdminToast';
import { AdminContent } from './components/AdminContent';

type Section = 'overview' | 'articles' | 'content' | 'donations' | 'contacts' | 'categories';
interface Props { onPreviewArticle: (article: ArticleItem) => void; onExitAdmin: () => void }

export function AdminScreen({ onPreviewArticle, onExitAdmin }: Props) {
  const [authenticated, setAuthenticated] = useState(false);
  const [restoring, setRestoring] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [section, setSection] = useState<Section>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState('');
  const { message, showToast } = useToast(3000);

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError('');
    try { setStats(await dashboardApi.get()); }
    catch (cause) { setStatsError(cause instanceof Error ? cause.message : 'Statistiques indisponibles'); }
    finally { setStatsLoading(false); }
  }, []);

  useEffect(() => {
    let active = true;
    void authApi.restore()
      .then((user) => {
        if (!active || !user) return;
        setAuthenticated(true);
        void loadStats();
      })
      .finally(() => { if (active) setRestoring(false); });
    return () => { active = false; };
  }, [loadStats]);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      await authApi.login(email, password);
      setAuthenticated(true);
      void loadStats();
    } catch (cause) {
      setLoginError(cause instanceof Error ? cause.message : 'Connexion impossible');
    } finally { setLoginLoading(false); }
  };

  const logout = async () => {
    await authApi.logout();
    setAuthenticated(false);
    setPassword('');
    setStats(null);
    setSection('overview');
  };

  if (restoring) return <p className="admin-state">Restauration de la session…</p>;
  if (!authenticated) return <AdminLogin email={email} password={password} hasError={Boolean(loginError)} loading={loginLoading} errorMessage={loginError} onEmailChange={setEmail} onPasswordChange={setPassword} onSubmit={login} onExit={onExitAdmin} />;

  const tabs: [Section, string][] = [['overview', 'Vue d’ensemble'], ['articles', 'Articles'], ['content', 'Contenus du site'], ['donations', 'Dons'], ['contacts', 'Messages'], ['categories', 'Catégories']];
  return <div className="flex flex-col gap-6 pb-12">
    <header className="bg-[#012d1d] text-white rounded-3xl p-5 flex flex-col md:flex-row gap-4 justify-between md:items-center">
      <div><span className="text-[#ffca98] text-xs font-bold uppercase">Secrétariat de Nagréogo</span><h1 className="text-2xl font-bold">Administration Bikienga</h1></div>
      <div className="flex gap-2"><button onClick={onExitAdmin} className="px-4 py-2 rounded-xl bg-white/10 text-xs">Voir le site</button><button onClick={() => void logout()} className="px-4 py-2 rounded-xl bg-[#ffca98] text-[#2c1600] text-xs font-bold">Déconnexion</button></div>
    </header>
    <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="Navigation administration">{tabs.map(([id, label]) => <button key={id} onClick={() => setSection(id)} className={`px-4 py-2.5 rounded-full whitespace-nowrap text-xs font-bold ${section === id ? 'bg-[#7d562d] text-white' : 'bg-white text-[#012d1d] border'}`}>{label}</button>)}</nav>
    {section === 'overview' && <AdminOverview stats={stats} loading={statsLoading} error={statsError} onRefresh={() => void loadStats()} />}
    {section === 'content' && <AdminContent notify={showToast} />}
    {section === 'articles' && <AdminArticles notify={showToast} onPreview={onPreviewArticle} onChanged={() => void loadStats()} />}
    {section === 'donations' && <AdminDonations notify={showToast} onChanged={() => void loadStats()} />}
    {section === 'contacts' && <AdminContacts notify={showToast} onChanged={() => void loadStats()} />}
    {section === 'categories' && <AdminCategories notify={showToast} />}
    <AdminToast message={message} />
  </div>;
}
