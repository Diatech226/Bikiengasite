import React, { useState, useMemo } from 'react';
import { ArticleItem } from '../types';
import { PRESET_CATEGORIES, PRESET_IMAGES } from '../data/blogStore';

interface AdminScreenProps {
  articles: ArticleItem[];
  onAddArticle: (article: Omit<ArticleItem, 'id'>) => void;
  onUpdateArticle: (id: string, updated: Partial<ArticleItem>) => void;
  onDeleteArticle: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onResetDefault: () => void;
  onPreviewArticle: (article: ArticleItem) => void;
  onExitAdmin: () => void;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({
  articles,
  onAddArticle,
  onUpdateArticle,
  onDeleteArticle,
  onToggleStatus,
  onToggleFeatured,
  onResetDefault,
  onPreviewArticle,
  onExitAdmin,
}) => {
  // Authentication / PIN code guard
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('nagreogo_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'featured'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(PRESET_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [author, setAuthor] = useState('Cheick Bikienga Seydou');
  const [date, setDate] = useState('');
  const [readTime, setReadTime] = useState('4 min');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [imageAlt, setImageAlt] = useState(PRESET_IMAGES[0].alt);
  const [excerpt, setExcerpt] = useState('');
  const [fullText, setFullText] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [isFeatured, setIsFeatured] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete Confirmation Modal State
  const [articleToDelete, setArticleToDelete] = useState<ArticleItem | null>(null);

  // Live Toast inside Admin
  const [adminToast, setAdminToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN or quick bypass: accepts 1234 or empty/admin
    if (pinInput === '1234' || pinInput.toLowerCase() === 'admin' || pinInput === '2026') {
      setIsAuthenticated(true);
      localStorage.setItem('nagreogo_admin_auth', 'true');
      setPinError(false);
      triggerToast('Connexion réussie au Secrétariat de Nagréogo');
    } else {
      setPinError(true);
    }
  };

  const handleQuickLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('nagreogo_admin_auth', 'true');
    setPinError(false);
    triggerToast('Accès direct autorisé au Secrétariat');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('nagreogo_admin_auth');
    setPinInput('');
  };

  // Format today's date in French
  const getTodayFormattedDate = () => {
    const now = new Date();
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  };

  // Open Editor for Creation
  const handleOpenCreate = () => {
    setEditingArticleId(null);
    setTitle('');
    setCategory(PRESET_CATEGORIES[0]);
    setCustomCategory('');
    setAuthor('Cheick Bikienga Seydou');
    setDate(getTodayFormattedDate());
    setReadTime('4 min');
    setImageUrl(PRESET_IMAGES[0].url);
    setImageAlt(PRESET_IMAGES[0].alt);
    setExcerpt('');
    setFullText('');
    setStatus('published');
    setIsFeatured(false);
    setFormError(null);
    setIsEditorOpen(true);
  };

  // Open Editor for Modification
  const handleOpenEdit = (art: ArticleItem) => {
    setEditingArticleId(art.id);
    setTitle(art.title);
    if (PRESET_CATEGORIES.includes(art.category)) {
      setCategory(art.category);
      setCustomCategory('');
    } else {
      setCategory('Autre');
      setCustomCategory(art.category);
    }
    setAuthor(art.author || 'Cheick Bikienga Seydou');
    setDate(art.date || getTodayFormattedDate());
    setReadTime(art.readTime || '4 min');
    setImageUrl(art.image);
    setImageAlt(art.alt || art.title);
    setExcerpt(art.excerpt);
    setFullText(art.fullText);
    setStatus(art.status || 'published');
    setIsFeatured(!!art.isFeatured);
    setFormError(null);
    setIsEditorOpen(true);
  };

  // Auto-calculate read time
  const handleAutoCalculateReadTime = () => {
    const words = (fullText.trim() + ' ' + excerpt.trim()).split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 180));
    setReadTime(`${minutes} min`);
    triggerToast(`Temps estimé : ${minutes} min (${words} mots)`);
  };

  // Insert template helpers into text
  const insertQuoteTemplate = () => {
    const quoteTemplate = `\n\n« Soigner la terre et nourrir les âmes avec constance, c'est préserver la paix de nos enfants. »\n— Cheick Bikienga Seydou\n\n`;
    setFullText((prev) => prev + quoteTemplate);
  };

  const insertBulletTemplate = () => {
    const listTemplate = `\n\nPrincipaux axes d'action :\n- 1. Restauration des cuvettes Zaï et apport de compost biologique.\n- 2. Protection de la nappe phréatique grâce à l'arrosage solaire maîtrisé.\n- 3. Réserve solidaire pour soutenir les ménages les plus vulnérables.\n\n`;
    setFullText((prev) => prev + listTemplate);
  };

  // Save Article (Create or Update)
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Veuillez renseigner le titre de l’article.');
      return;
    }
    if (!excerpt.trim()) {
      setFormError('Veuillez renseigner un court extrait ou chapô.');
      return;
    }
    if (!fullText.trim()) {
      setFormError('Veuillez renseigner le texte complet de l’article.');
      return;
    }

    const finalCategory = category === 'Autre' && customCategory.trim()
      ? customCategory.trim()
      : category;

    if (editingArticleId) {
      // Update existing
      onUpdateArticle(editingArticleId, {
        title: title.trim(),
        category: finalCategory,
        author: author.trim(),
        date: date.trim() || getTodayFormattedDate(),
        readTime: readTime.trim() || '4 min',
        image: imageUrl.trim() || PRESET_IMAGES[0].url,
        alt: imageAlt.trim() || title.trim(),
        excerpt: excerpt.trim(),
        fullText: fullText.trim(),
        status,
        isFeatured,
        updatedAt: getTodayFormattedDate(),
      });
      triggerToast('Article mis à jour avec succès');
    } else {
      // Create new
      onAddArticle({
        title: title.trim(),
        category: finalCategory,
        author: author.trim(),
        date: date.trim() || getTodayFormattedDate(),
        readTime: readTime.trim() || '4 min',
        image: imageUrl.trim() || PRESET_IMAGES[0].url,
        alt: imageAlt.trim() || title.trim(),
        excerpt: excerpt.trim(),
        fullText: fullText.trim(),
        status,
        isFeatured,
        viewsCount: 1,
        updatedAt: getTodayFormattedDate(),
      });
      triggerToast('Nouvel article créé et enregistré');
    }

    setIsEditorOpen(false);
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (articleToDelete) {
      onDeleteArticle(articleToDelete.id);
      triggerToast(`L'article « ${articleToDelete.title.substring(0, 28)}... » a été supprimé`);
      setArticleToDelete(null);
    }
  };

  // Export articles as JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(articles, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `nagreogo_blog_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerToast('Sauvegarde JSON téléchargée');
  };

  // Computed metrics
  const stats = useMemo(() => {
    const total = articles.length;
    const published = articles.filter((a) => (a.status || 'published') === 'published').length;
    const drafts = articles.filter((a) => a.status === 'draft').length;
    const featured = articles.filter((a) => !!a.isFeatured).length;
    const totalViews = articles.reduce((acc, curr) => acc + (curr.viewsCount || 1200), 0);
    return { total, published, drafts, featured, totalViews };
  }, [articles]);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        art.title.toLowerCase().includes(q) ||
        art.excerpt.toLowerCase().includes(q) ||
        art.category.toLowerCase().includes(q) ||
        (art.author && art.author.toLowerCase().includes(q));

      // Status
      let matchesStatus = true;
      if (statusFilter === 'published') {
        matchesStatus = (art.status || 'published') === 'published';
      } else if (statusFilter === 'draft') {
        matchesStatus = art.status === 'draft';
      } else if (statusFilter === 'featured') {
        matchesStatus = !!art.isFeatured;
      }

      // Category
      const matchesCategory =
        selectedCategory === 'all' || art.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [articles, searchQuery, statusFilter, selectedCategory]);

  // If not authenticated, render Login Screen
  if (!isAuthenticated) {
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
            <h2 className="font-headline-sm text-2xl font-bold text-[#012d1d]">
              Espace Administration
            </h2>
            <p className="text-xs text-[#414844] max-w-xs leading-relaxed">
              Gestion éditoriale, publication des enseignements et chroniques de Nagréogo.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#012d1d] flex items-center justify-between">
                <span>Code d'accès administrateur</span>
                <span className="text-[11px] text-[#717973] font-normal">Par défaut : 1234</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="Saisissez le code PIN..."
                  className={`w-full h-12 px-4 rounded-xl border bg-[#f3fbf5] text-[#151d1a] font-medium text-sm focus:outline-none transition-colors ${
                    pinError
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-[#c1c8c2] focus:border-[#012d1d] focus:ring-2 focus:ring-[#c1ecd4]'
                  }`}
                  autoFocus
                />
                <span className="absolute right-3.5 top-3.5 text-[#717973] material-symbols-outlined text-[20px]">
                  lock
                </span>
              </div>
              {pinError && (
                <span className="text-xs text-red-600 font-medium">
                  Code incorrect. Utilisez le code par défaut : 1234 ou cliquez ci-dessous.
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#012d1d] text-white font-label-md text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#1b4332] transition-colors shadow-sm active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[20px]">login</span>
              <span>Déverrouiller l'administration</span>
            </button>
          </form>

          <div className="pt-4 border-t border-[#e2eae4] flex flex-col gap-3">
            <button
              onClick={handleQuickLogin}
              className="w-full py-2.5 px-4 rounded-xl bg-[#ffca98]/40 hover:bg-[#ffca98]/70 text-[#623f18] text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>Accès rapide direct (Mode Démo)</span>
            </button>

            <button
              onClick={onExitAdmin}
              className="text-xs text-[#717973] hover:text-[#012d1d] font-semibold text-center transition-colors"
            >
              ← Retour au site public
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-16 gap-6 md:gap-8">
      {/* Top Banner: Secrétariat header & Action controls */}
      <section className="bg-white rounded-3xl p-5 sm:p-7 shadow-xs border border-[#c1c8c2]/40 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#012d1d] text-[#ffca98] flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="material-symbols-outlined text-[32px]">edit_note</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#c1ecd4] text-[#002114] text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#012d1d]" />
                Session Secrétariat Active
              </span>
              <span className="text-xs text-[#717973]">Nagréogo</span>
            </div>
            <h1 className="font-headline-md text-xl sm:text-2xl lg:text-3xl text-[#012d1d] font-bold mt-1">
              Gestionnaire du Blog & Publications
            </h1>
            <p className="text-xs sm:text-sm text-[#414844] mt-0.5">
              Rédigez, modifiez, prévisualisez et organisez les enseignements et chroniques du village.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleOpenCreate}
            className="flex-1 sm:flex-initial h-11 px-5 rounded-full bg-[#012d1d] hover:bg-[#1b4332] text-white font-label-md text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px] text-[#ffca98]">add</span>
            <span>Rédiger un article</span>
          </button>

          <button
            onClick={handleExportJSON}
            title="Exporter une sauvegarde JSON de tous les articles"
            className="h-11 px-3.5 rounded-full bg-[#f3fbf5] hover:bg-[#e2eae4] text-[#012d1d] border border-[#c1c8c2] text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span className="hidden sm:inline">Sauvegarder JSON</span>
          </button>

          <button
            onClick={handleLogout}
            title="Verrouiller la session administrateur"
            className="h-11 px-3.5 rounded-full bg-[#f3fbf5] hover:bg-red-50 text-red-700 border border-red-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span className="hidden sm:inline">Quitter</span>
          </button>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#c1c8c2]/40 shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-[#7d562d] uppercase tracking-wider">
              Total Articles
            </span>
            <span className="font-headline-md text-2xl sm:text-3xl text-[#012d1d] font-bold mt-1">
              {stats.total}
            </span>
            <span className="text-[11px] text-[#414844] mt-0.5">En base de données</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#e7f0ea] text-[#012d1d] flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">article</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#c1c8c2]/40 shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              En Ligne
            </span>
            <span className="font-headline-md text-2xl sm:text-3xl text-emerald-800 font-bold mt-1">
              {stats.published}
            </span>
            <span className="text-[11px] text-[#414844] mt-0.5">Visibles du public</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">public</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#c1c8c2]/40 shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
              Brouillons
            </span>
            <span className="font-headline-md text-2xl sm:text-3xl text-amber-800 font-bold mt-1">
              {stats.drafts}
            </span>
            <span className="text-[11px] text-[#414844] mt-0.5">Non publiés</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">pending_actions</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#c1c8c2]/40 shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-[#7d562d] uppercase tracking-wider">
              À la une
            </span>
            <span className="font-headline-md text-2xl sm:text-3xl text-[#7d562d] font-bold mt-1">
              {stats.featured}
            </span>
            <span className="text-[11px] text-[#414844] mt-0.5">Mis en valeur</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#ffdcbd]/50 text-[#7d562d] flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">star</span>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 border border-[#c1c8c2]/40 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-3 text-[#717973] material-symbols-outlined text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par titre, auteur, extrait ou mot-clé..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#c1c8c2] bg-[#f3fbf5] text-[#151d1a] text-sm focus:outline-none focus:border-[#012d1d] focus:ring-1 focus:ring-[#012d1d]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-[#717973] hover:text-[#151d1a]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>

          {/* Status Segmented Buttons */}
          <div className="flex items-center gap-1 p-1 bg-[#e7f0ea] rounded-xl self-start md:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'all'
                  ? 'bg-white text-[#012d1d] shadow-xs'
                  : 'text-[#414844] hover:text-[#012d1d]'
              }`}
            >
              Tous ({stats.total})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'published'
                  ? 'bg-white text-[#012d1d] shadow-xs'
                  : 'text-[#414844] hover:text-[#012d1d]'
              }`}
            >
              Publiés ({stats.published})
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'draft'
                  ? 'bg-white text-[#012d1d] shadow-xs'
                  : 'text-[#414844] hover:text-[#012d1d]'
              }`}
            >
              Brouillons ({stats.drafts})
            </button>
            <button
              onClick={() => setStatusFilter('featured')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'featured'
                  ? 'bg-white text-[#012d1d] shadow-xs'
                  : 'text-[#414844] hover:text-[#012d1d]'
              }`}
            >
              ⭐ À la une ({stats.featured})
            </button>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-[#717973] font-medium mr-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">filter_alt</span>
            Catégorie :
          </span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors flex-shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-[#012d1d] text-white font-bold'
                : 'bg-[#f3fbf5] hover:bg-[#e2eae4] text-[#414844] border border-[#c1c8c2]/50'
            }`}
          >
            Toutes
          </button>
          {PRESET_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors flex-shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#012d1d] text-white font-bold'
                  : 'bg-[#f3fbf5] hover:bg-[#e2eae4] text-[#414844] border border-[#c1c8c2]/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Articles Management Table / List */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[#7d562d] uppercase tracking-wider">
            {filteredArticles.length} Article{filteredArticles.length > 1 ? 's' : ''} trouvé{filteredArticles.length > 1 ? 's' : ''}
          </span>
          <button
            onClick={onResetDefault}
            className="text-xs text-[#717973] hover:text-[#7d562d] underline font-medium transition-colors"
          >
            Rétablir les articles de démonstration
          </button>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-[#c1c8c2] flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#f3fbf5] text-[#717973] flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">search_off</span>
            </div>
            <h3 className="font-headline-sm text-base font-bold text-[#012d1d]">
              Aucun article ne correspond aux filtres
            </h3>
            <p className="text-xs text-[#414844] max-w-sm">
              Essayez de réinitialiser la recherche ou de changer de filtre de catégorie.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setSelectedCategory('all');
              }}
              className="mt-2 px-4 py-2 rounded-full bg-[#e2eae4] text-[#012d1d] text-xs font-bold hover:bg-[#dce5de]"
            >
              Effacer les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {filteredArticles.map((art) => {
              const isPub = (art.status || 'published') === 'published';
              return (
                <div
                  key={art.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-[#c1c8c2]/50 shadow-xs hover:border-[#7d562d]/50 hover:shadow-sm transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div className="w-20 h-20 sm:w-28 sm:h-24 rounded-xl overflow-hidden bg-[#e2eae4] flex-shrink-0 relative group">
                      <img
                        src={art.image}
                        alt={art.alt || art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      {art.isFeatured && (
                        <span className="absolute top-1.5 left-1.5 bg-[#7d562d] text-white p-0.5 rounded-full text-[12px] flex items-center justify-center shadow-xs" title="Mis à la une">
                          <span className="material-symbols-outlined text-[14px]">star</span>
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col min-w-0 gap-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#f3fbf5] text-[#7d562d] border border-[#c1c8c2]/50 font-bold text-[11px]">
                          {art.category}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                            isPub
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isPub ? 'bg-emerald-600' : 'bg-amber-600'
                            }`}
                          />
                          {isPub ? 'Publié' : 'Brouillon'}
                        </span>

                        <span className="text-[11px] text-[#717973]">
                          {art.date} • {art.readTime}
                        </span>
                      </div>

                      <h3 className="font-headline-sm text-sm sm:text-base text-[#012d1d] font-bold line-clamp-1 leading-snug">
                        {art.title}
                      </h3>

                      <p className="text-xs text-[#414844] line-clamp-2 leading-relaxed">
                        {art.excerpt}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-[#717973] mt-0.5">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">person</span>
                          {art.author || 'Cheick Bikienga'}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">visibility</span>
                          {art.viewsCount || 1200} lectures
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1.5 self-end md:self-center flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#e2eae4] w-full md:w-auto justify-end">
                    {/* Toggle Status */}
                    <button
                      onClick={() => onToggleStatus(art.id)}
                      title={isPub ? 'Basculer en brouillon' : 'Publier en ligne'}
                      className={`h-9 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        isPub
                          ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isPub ? 'public' : 'edit_document'}
                      </span>
                      <span>{isPub ? 'En ligne' : 'Brouillon'}</span>
                    </button>

                    {/* Toggle Featured */}
                    <button
                      onClick={() => onToggleFeatured(art.id)}
                      title={art.isFeatured ? 'Retirer de la une' : 'Mettre à la une sur l’accueil'}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        art.isFeatured
                          ? 'bg-[#ffdcbd] text-[#7d562d]'
                          : 'bg-[#f3fbf5] text-[#717973] hover:text-[#7d562d]'
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        style={{ fontVariationSettings: art.isFeatured ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        star
                      </span>
                    </button>

                    {/* Preview Button */}
                    <button
                      onClick={() => onPreviewArticle(art)}
                      title="Prévisualiser l'article tel que les visiteurs le voient"
                      className="w-9 h-9 rounded-lg bg-[#f3fbf5] hover:bg-[#e2eae4] text-[#012d1d] flex items-center justify-center transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => handleOpenEdit(art)}
                      title="Modifier cet article"
                      className="h-9 px-3 rounded-lg bg-[#012d1d] hover:bg-[#1b4332] text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                      <span>Modifier</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => setArticleToDelete(art)}
                      title="Supprimer cet article"
                      className="w-9 h-9 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Editor Modal (Full-featured creation & editing) */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div
            className="w-full max-w-3xl bg-[#f8fbf9] rounded-3xl overflow-hidden shadow-2xl border border-[#c1c8c2] flex flex-col my-auto max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#012d1d] text-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-[#ffca98] text-[#7a532a] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[20px]">
                    {editingArticleId ? 'edit' : 'post_add'}
                  </span>
                </span>
                <div>
                  <h3 className="font-headline-sm text-base sm:text-lg font-bold">
                    {editingArticleId ? 'Modifier l’article' : 'Rédiger une nouvelle publication'}
                  </h3>
                  <span className="text-[11px] text-[#c1ecd4]">
                    Plateforme éditoriale du village de Nagréogo
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsEditorOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveArticle} className="p-5 sm:p-7 overflow-y-auto flex flex-col gap-5">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{formError}</span>
                </div>
              )}

              {/* Titre */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#012d1d] uppercase tracking-wider">
                  Titre de l'article *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex : La force du Zaï : régénération des sols et fraternité..."
                  className="w-full h-12 px-4 rounded-xl border border-[#c1c8c2] bg-white text-[#151d1a] font-bold text-base focus:outline-none focus:border-[#012d1d] focus:ring-2 focus:ring-[#c1ecd4]"
                />
              </div>

              {/* Category, Author, Date & Reading Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {/* Catégorie */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#012d1d]">
                    Catégorie *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-[#c1c8c2] bg-white text-xs font-semibold text-[#151d1a] focus:outline-none focus:border-[#012d1d]"
                  >
                    {PRESET_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="Autre">Autre catégorie personnalisée...</option>
                  </select>
                </div>

                {/* Si Autre Catégorie */}
                {category === 'Autre' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#012d1d]">
                      Nom catégorie personnalisée
                    </label>
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="Ex : Forages & Santé"
                      className="w-full h-11 px-3 rounded-xl border border-[#c1c8c2] bg-white text-xs font-medium focus:outline-none focus:border-[#012d1d]"
                    />
                  </div>
                )}

                {/* Auteur */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#012d1d]">
                    Auteur
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Cheick Bikienga Seydou"
                    className="w-full h-11 px-3 rounded-xl border border-[#c1c8c2] bg-white text-xs font-medium focus:outline-none focus:border-[#012d1d]"
                  />
                </div>

                {/* Date */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#012d1d]">
                    Date de publication
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="Ex : 28 Septembre 2026"
                    className="w-full h-11 px-3 rounded-xl border border-[#c1c8c2] bg-white text-xs font-medium focus:outline-none focus:border-[#012d1d]"
                  />
                </div>

                {/* Temps de lecture */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#012d1d]">
                      Temps de lecture
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoCalculateReadTime}
                      className="text-[10px] text-[#7d562d] font-bold hover:underline"
                    >
                      Calculer
                    </button>
                  </div>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="Ex : 4 min"
                    className="w-full h-11 px-3 rounded-xl border border-[#c1c8c2] bg-white text-xs font-medium focus:outline-none focus:border-[#012d1d]"
                  />
                </div>
              </div>

              {/* Image Picker with Quick Presets */}
              <div className="flex flex-col gap-2 p-4 bg-white rounded-2xl border border-[#c1c8c2]/60">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#012d1d] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-[#7d562d]">image</span>
                    Illustration & Image de couverture
                  </label>
                  <span className="text-[11px] text-[#717973]">
                    Sélectionnez un visuel de Nagréogo ou saisissez une URL
                  </span>
                </div>

                {/* Preset image thumbnails */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {PRESET_IMAGES.slice(0, 8).map((preset, idx) => {
                    const isSelected = imageUrl === preset.url;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setImageUrl(preset.url);
                          setImageAlt(preset.alt);
                        }}
                        className={`group relative aspect-video rounded-xl overflow-hidden border-2 text-left transition-all ${
                          isSelected
                            ? 'border-[#012d1d] ring-2 ring-[#c1ecd4] shadow-sm'
                            : 'border-transparent opacity-75 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.alt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <span className="absolute bottom-1 left-1.5 right-1.5 text-[10px] text-white font-semibold line-clamp-1 leading-tight">
                          {preset.label}
                        </span>
                        {isSelected && (
                          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#012d1d] text-white flex items-center justify-center text-[10px]">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Custom URL & Alt input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="URL de l'image (https://...)"
                    className="w-full h-10 px-3 rounded-xl border border-[#c1c8c2] text-xs focus:outline-none focus:border-[#012d1d]"
                  />
                  <input
                    type="text"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    placeholder="Texte alternatif (description de l'image)"
                    className="w-full h-10 px-3 rounded-xl border border-[#c1c8c2] text-xs focus:outline-none focus:border-[#012d1d]"
                  />
                </div>
              </div>

              {/* Résumé / Extrait */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#012d1d] uppercase tracking-wider">
                    Extrait / Chapô d'accroche *
                  </label>
                  <span className="text-[11px] text-[#717973]">
                    {excerpt.length} caractères (1 à 2 phrases percutantes)
                  </span>
                </div>
                <textarea
                  rows={2}
                  required
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Pourquoi le retour à la terre fortifie l'esprit et rassemble les générations au village..."
                  className="w-full p-3 rounded-xl border border-[#c1c8c2] bg-white text-[#151d1a] text-sm focus:outline-none focus:border-[#012d1d] focus:ring-2 focus:ring-[#c1ecd4]"
                />
              </div>

              {/* Contenu Intégral */}
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-bold text-[#012d1d] uppercase tracking-wider">
                    Contenu Intégral de l'article *
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={insertQuoteTemplate}
                      className="px-2.5 py-1 rounded-lg bg-[#f3fbf5] hover:bg-[#e2eae4] text-[#012d1d] text-[11px] font-semibold border border-[#c1c8c2]/50 flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">format_quote</span>
                      <span>+ Citation Cheick</span>
                    </button>
                    <button
                      type="button"
                      onClick={insertBulletTemplate}
                      className="px-2.5 py-1 rounded-lg bg-[#f3fbf5] hover:bg-[#e2eae4] text-[#012d1d] text-[11px] font-semibold border border-[#c1c8c2]/50 flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">format_list_bulleted</span>
                      <span>+ Liste à puces</span>
                    </button>
                  </div>
                </div>

                <textarea
                  rows={9}
                  required
                  value={fullText}
                  onChange={(e) => setFullText(e.target.value)}
                  placeholder="Rédigez ici le développement de l'article, les enseignements du Cheick, les chiffres et témoignages des villageois..."
                  className="w-full p-4 rounded-xl border border-[#c1c8c2] bg-white text-[#151d1a] text-sm leading-relaxed focus:outline-none focus:border-[#012d1d] focus:ring-2 focus:ring-[#c1ecd4] font-serif"
                />
              </div>

              {/* Status and Featured checkboxes */}
              <div className="p-4 bg-[#e7f0ea] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status_radio"
                      checked={status === 'published'}
                      onChange={() => setStatus('published')}
                      className="w-4 h-4 text-[#012d1d] focus:ring-[#012d1d]"
                    />
                    <span className="text-xs font-bold text-[#012d1d]">
                      Publier immédiatement en ligne
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status_radio"
                      checked={status === 'draft'}
                      onChange={() => setStatus('draft')}
                      className="w-4 h-4 text-[#012d1d] focus:ring-[#012d1d]"
                    />
                    <span className="text-xs font-semibold text-[#414844]">
                      Garder comme brouillon
                    </span>
                  </label>
                </div>

                <label className="flex items-center gap-2 cursor-pointer self-start sm:self-auto">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-[#7d562d] focus:ring-[#7d562d]"
                  />
                  <span className="text-xs font-bold text-[#7d562d] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">star</span>
                    Mettre à la une sur l'accueil
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-[#c1c8c2]">
                <button
                  type="button"
                  onClick={() => {
                    const tempArticle: ArticleItem = {
                      id: editingArticleId || 'preview-temp',
                      title: title || 'Titre provisoire',
                      category: category === 'Autre' && customCategory ? customCategory : category,
                      author: author || 'Cheick Bikienga Seydou',
                      date: date || getTodayFormattedDate(),
                      readTime: readTime || '4 min',
                      image: imageUrl,
                      alt: imageAlt,
                      excerpt: excerpt || 'Extrait de prévisualisation...',
                      fullText: fullText || 'Texte intégral en cours de rédaction...',
                      status,
                      isFeatured,
                    };
                    onPreviewArticle(tempArticle);
                  }}
                  className="w-full sm:w-auto h-11 px-5 rounded-full bg-[#f3fbf5] hover:bg-[#e2eae4] text-[#012d1d] border border-[#c1c8c2] text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                  <span>Aperçu visiteur</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="w-full sm:w-auto h-11 px-5 rounded-full hover:bg-[#e2eae4] text-[#414844] text-xs font-semibold transition-colors text-center"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto h-11 px-6 rounded-full bg-[#012d1d] hover:bg-[#1b4332] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#ffca98]">
                    check_circle
                  </span>
                  <span>{editingArticleId ? 'Enregistrer les modifications' : 'Enregistrer et publier'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {articleToDelete && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-red-200 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">delete_forever</span>
            </div>

            <div>
              <h3 className="font-headline-sm text-lg font-bold text-[#012d1d]">
                Confirmer la suppression
              </h3>
              <p className="text-xs text-[#414844] mt-1 leading-relaxed">
                Êtes-vous sûr de vouloir supprimer l'article suivant ?
              </p>
              <div className="p-3 mt-2 bg-[#f3fbf5] rounded-xl border border-[#c1c8c2]/50 text-xs font-bold text-[#012d1d]">
                « {articleToDelete.title} »
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setArticleToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#414844] hover:bg-[#e2eae4] transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
              >
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      {adminToast && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-[#012d1d] text-white text-xs font-semibold shadow-xl flex items-center gap-2 border border-[#c1ecd4]/30 animate-in fade-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined text-[18px] text-[#ffca98]">
            check_circle
          </span>
          <span>{adminToast}</span>
        </div>
      )}
    </div>
  );
};
