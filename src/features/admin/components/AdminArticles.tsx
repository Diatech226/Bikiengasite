import { FormEvent, useEffect, useMemo, useState } from 'react';
import { PRESET_IMAGES } from '../../../data/blogStore';
import { Category, categoryApi } from '../../../services/categoryApi';
import { ArticleItem } from '../../../types';
import { useAdminArticles } from '../hooks/useAdminArticles';

interface Props { notify: (message: string) => void; onPreview: (article: ArticleItem) => void; onChanged: () => void }
interface ArticleForm { title: string; categoryId: string; author: string; readTime: string; image: string; alt: string; excerpt: string; fullText: string; status: 'published' | 'draft'; isFeatured: boolean }
const emptyForm = (categoryId = ''): ArticleForm => ({ title: '', categoryId, author: 'Cheick Bikienga Seydou', readTime: '4 min', image: PRESET_IMAGES[0].url, alt: PRESET_IMAGES[0].alt, excerpt: '', fullText: '', status: 'published', isFeatured: false });

export function AdminArticles({ notify, onPreview, onChanged }: Props) {
  const admin = useAdminArticles(notify);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [category, setCategory] = useState('all');
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<ArticleForm>(emptyForm());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    void categoryApi.list().then((items) => {
      if (!active) return;
      setCategories(items);
      setForm((current) => current.categoryId ? current : { ...current, categoryId: items[0]?.id ?? '' });
    }).catch((cause) => admin.setError(cause instanceof Error ? cause.message : 'Catégories indisponibles'));
    return () => { active = false; };
  }, [admin.setError]);

  const filtered = useMemo(() => admin.articles.filter((article) =>
    (status === 'all' || (status === 'featured' ? article.isFeatured : article.status === status)) &&
    (category === 'all' || article.categoryId === category) &&
    `${article.title} ${article.excerpt} ${article.fullText} ${article.category}`.toLowerCase().includes(search.toLowerCase()),
  ), [admin.articles, search, status, category]);

  const open = (article?: ArticleItem) => {
    setEditing(article?.id ?? 'new');
    setForm(article ? { title: article.title, categoryId: article.categoryId ?? '', author: article.author ?? 'Cheick Bikienga Seydou', readTime: article.readTime, image: article.image, alt: article.alt, excerpt: article.excerpt, fullText: article.fullText, status: article.status ?? 'published', isFeatured: Boolean(article.isFeatured) } : emptyForm(categories[0]?.id));
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.categoryId) { admin.setError('Sélectionnez une catégorie MongoDB.'); return; }
    setSaving(true);
    admin.setError('');
    const selectedCategory = categories.find((item) => item.id === form.categoryId);
    try {
      const payload = { ...form, category: selectedCategory?.name ?? '', date: new Date().toLocaleDateString('fr-FR') };
      if (editing === 'new') await admin.create(payload); else await admin.update(editing!, payload);
      setEditing(null);
      onChanged();
    } catch (cause) { admin.setError(cause instanceof Error ? cause.message : 'Enregistrement impossible'); }
    finally { setSaving(false); }
  };
  const action = async (operation: () => Promise<void>) => {
    try { await operation(); onChanged(); }
    catch (cause) { admin.setError(cause instanceof Error ? cause.message : 'Opération impossible'); }
  };
  const calculateReadTime = () => {
    const words = `${form.excerpt} ${form.fullText}`.trim().split(/\s+/).filter(Boolean).length;
    setForm({ ...form, readTime: `${Math.max(1, Math.ceil(words / 200))} min` });
  };

  return <section className="flex flex-col gap-4">
    <div className="flex justify-between"><h2 className="text-xl font-bold text-[#012d1d]">Articles</h2><button className="admin-button" onClick={() => open()} disabled={!categories.length}>+ Nouvel article</button></div>
    <div className="admin-filters"><input aria-label="Rechercher les articles" placeholder="Rechercher…" value={search} onChange={(event) => setSearch(event.target.value)} /><select aria-label="Filtrer par statut" value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">Tous les statuts</option><option value="published">Publiés</option><option value="draft">Brouillons</option><option value="featured">À la une</option></select><select aria-label="Filtrer par catégorie" value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">Toutes les catégories</option>{categories.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></div>
    {admin.error && <p role="alert" className="admin-error">{admin.error}</p>}
    {admin.loading ? <p className="admin-state">Chargement des articles…</p> : filtered.length === 0 ? <p className="admin-state">Aucun article à afficher.</p> : <div className="flex flex-col gap-3">{filtered.map((article) => <article className="admin-row" key={article.id}><div><strong>{article.title}</strong><p>{article.category} · {article.status === 'draft' ? 'Brouillon' : 'Publié'} · {article.viewsCount ?? 0} lectures</p></div><div><button className="admin-button" onClick={() => onPreview(article)}>Voir</button><button className="admin-button" onClick={() => open(article)}>Modifier</button><button className="admin-button" onClick={() => void action(() => admin.toggleStatus(article.id))}>{article.status === 'draft' ? 'Publier' : 'Dépublier'}</button><button className="admin-button" onClick={() => void action(() => admin.toggleFeatured(article.id))}>{article.isFeatured ? 'Retirer la une' : 'À la une'}</button><button aria-label={`Supprimer ${article.title}`} className="admin-button text-red-700" onClick={() => confirm('Supprimer cet article ?') && void action(() => admin.remove(article.id))}>Supprimer</button></div></article>)}</div>}
    {editing && <div role="dialog" aria-modal="true" aria-labelledby="article-editor-title" className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto"><form onSubmit={submit} className="max-w-2xl mx-auto bg-[#f8fbf9] rounded-3xl p-6 flex flex-col gap-3"><div className="flex justify-between"><h3 id="article-editor-title" className="font-bold text-lg">{editing === 'new' ? 'Nouvel article' : 'Modifier l’article'}</h3><button aria-label="Fermer l’éditeur" type="button" onClick={() => setEditing(null)}>✕</button></div>
      <label>Titre<input required minLength={3} maxLength={180} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
      <label>Catégorie<select required value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })}><option value="" disabled>Choisir une catégorie</option>{categories.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
      <label>Auteur<input required value={form.author} onChange={(event) => setForm({ ...form, author: event.target.value })} /></label>
      <label>URL de l’image<input required type="url" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} /></label>
      <label>Texte alternatif<input required value={form.alt} onChange={(event) => setForm({ ...form, alt: event.target.value })} /></label>
      <label>Résumé<textarea required minLength={10} value={form.excerpt} onChange={(event) => setForm({ ...form, excerpt: event.target.value })} /></label>
      <label>Contenu complet<textarea required minLength={20} rows={10} value={form.fullText} onChange={(event) => setForm({ ...form, fullText: event.target.value })} /></label>
      <div className="flex flex-col sm:flex-row gap-2 sm:items-end"><label className="flex-1">Temps de lecture<input required pattern="[0-9]+\\s*min" value={form.readTime} onChange={(event) => setForm({ ...form, readTime: event.target.value })} /></label><button type="button" className="admin-button" onClick={calculateReadTime}>Calculer automatiquement</button></div>
      <div className="flex gap-3"><label>Statut<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as 'published' | 'draft' })}><option value="published">Publié</option><option value="draft">Brouillon</option></select></label><label><input type="checkbox" checked={form.isFeatured} onChange={(event) => setForm({ ...form, isFeatured: event.target.checked })} /> À la une</label></div>
      <button disabled={saving} className="h-12 rounded-xl bg-[#012d1d] text-white font-bold">{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
    </form></div>}
  </section>;
}
