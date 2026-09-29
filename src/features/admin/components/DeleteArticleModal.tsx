import { ArticleItem } from '../../../types';

interface DeleteArticleModalProps {
  article: ArticleItem | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteArticleModal({ article, onCancel, onConfirm }: DeleteArticleModalProps) {
  if (!article) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="delete-article-title" onClick={onCancel}>
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl flex flex-col gap-5 animate-in zoom-in-95 duration-150" onClick={(event) => event.stopPropagation()}>
        <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center"><span className="material-symbols-outlined text-[26px]">delete_forever</span></div>
        <div>
          <h3 id="delete-article-title" className="font-headline-sm text-lg font-bold text-[#012d1d]">Confirmer la suppression</h3>
          <p className="text-xs text-[#414844] mt-1 leading-relaxed">Êtes-vous sûr de vouloir supprimer l'article suivant ?</p>
          <div className="p-3 mt-2 bg-[#f3fbf5] rounded-xl border border-[#c1c8c2]/50 text-xs font-bold text-[#012d1d]">« {article.title} »</div>
        </div>
        <div className="flex items-center justify-end gap-2 pt-2">
          <button onClick={onCancel} className="px-4 py-2 rounded-xl text-xs font-semibold text-[#414844] hover:bg-[#e2eae4] transition-colors">Annuler</button>
          <button onClick={onConfirm} className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95">Supprimer définitivement</button>
        </div>
      </div>
    </div>
  );
}
