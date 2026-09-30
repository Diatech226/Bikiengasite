import { DashboardStats } from '../../../services/dashboardApi';
interface Props { stats: DashboardStats | null; loading: boolean; error: string; onRefresh: () => void; }
export function AdminOverview({ stats, loading, error, onRefresh }: Props) {
 const cards = [
  ['Articles', stats?.totalArticles, 'article'], ['Publiés', stats?.publishedArticles, 'public'], ['Brouillons', stats?.draftArticles, 'edit_note'], ['À la une', stats?.featuredArticles, 'star'],
  ['Lectures', stats?.totalArticleViews, 'visibility'], ['Dons en attente', stats?.donationsPending, 'volunteer_activism'], ['Dons confirmés', stats?.donationsConfirmed, 'verified'], ['Messages en attente', stats?.contactRequestsPending, 'mail'],
 ] as const;
 return <section className="flex flex-col gap-5"><div className="flex items-center justify-between"><div><h2 className="text-xl font-bold text-[#012d1d]">Vue d’ensemble</h2><p className="text-xs text-[#717973]">Statistiques consolidées par MongoDB.</p></div><button onClick={onRefresh} disabled={loading} className="px-4 py-2 rounded-xl bg-[#e7f0ea] text-[#012d1d] text-xs font-bold disabled:opacity-50">↻ Actualiser</button></div>{error&&<p role="alert" className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</p>}<div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{cards.map(([label,value,icon])=><article key={label} className="bg-white border border-[#c1c8c2]/50 rounded-2xl p-4 shadow-sm"><span className="material-symbols-outlined text-[#7d562d]">{icon}</span><p className="mt-3 text-2xl font-bold text-[#012d1d]">{loading?'…':(value??0).toLocaleString('fr-FR')}</p><p className="text-xs text-[#414844]">{label}</p></article>)}</div></section>;
}
