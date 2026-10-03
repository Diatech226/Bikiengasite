import { useMemo, useState } from 'react';
import { MediaItem } from '../../../services/contentApi';

const sectionLabels = { home: 'Accueil', agriculture: 'Agriculture', elevage: 'Élevage', humanitaire: 'Humanitaire' };
const typeLabels = { reportage: 'Reportage', chronique: 'Chronique', projet: 'Projet' };

export function MediaList({ items, busy, onEdit, onToggle, onDelete }: { items: MediaItem[]; busy: boolean; onEdit: (item: MediaItem) => void; onToggle: (item: MediaItem) => void; onDelete: (item: MediaItem) => void }) {
  const [search, setSearch] = useState(''); const [section, setSection] = useState('all'); const [type, setType] = useState('all'); const [status, setStatus] = useState('all');
  const filtered = useMemo(() => items.filter((item) => {
    const matchesSearch = `${item.title} ${item.description}`.toLocaleLowerCase('fr').includes(search.trim().toLocaleLowerCase('fr'));
    return matchesSearch && (section === 'all' || item.section === section) && (type === 'all' || item.type === type) && (status === 'all' || (status === 'visible') === item.isActive);
  }), [items, search, section, type, status]);
  return <section aria-labelledby="media-list-title" className="mt-8 border-t pt-6">
    <h3 id="media-list-title" className="text-lg font-bold">Liste des médias <span className="text-sm font-normal text-gray-500">({filtered.length})</span></h3>
    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <label className="text-xs font-bold">Recherche<input className="admin-input mt-1" type="search" value={search} placeholder="Ex. forage" onChange={(event) => setSearch(event.target.value)} /></label>
      <label className="text-xs font-bold">Section<select className="admin-input mt-1" value={section} onChange={(event) => setSection(event.target.value)}><option value="all">Toutes</option>{Object.entries(sectionLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label className="text-xs font-bold">Type<select className="admin-input mt-1" value={type} onChange={(event) => setType(event.target.value)}><option value="all">Tous</option>{Object.entries(typeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label className="text-xs font-bold">Statut<select className="admin-input mt-1" value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">Tous</option><option value="visible">Visible</option><option value="hidden">Masqué</option></select></label>
    </div>
    <div className="mt-5 space-y-3">
      {filtered.length === 0 && <p className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-500">Aucun média ne correspond aux filtres.</p>}
      {filtered.map((entry) => <article key={entry.id || entry.slug} className="grid min-w-0 gap-3 rounded-xl border p-3 sm:grid-cols-[80px_minmax(0,1fr)_auto] sm:items-center">
        {entry.imageUrl ? <img src={entry.imageUrl} alt={entry.imageAlt || ''} className="h-14 w-20 rounded-lg bg-gray-100 object-cover" /> : <div className="grid h-14 w-20 place-items-center rounded-lg bg-gray-100 text-xs">Sans image</div>}
        <div className="min-w-0"><strong className="block break-words text-sm">{entry.title}</strong><p className="text-xs text-gray-600">{typeLabels[entry.type]} · {sectionLabels[entry.section]} · ordre {entry.order}</p><span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-bold ${entry.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>{entry.isActive ? 'Visible' : 'Masqué'}</span></div>
        <div className="flex flex-wrap gap-2 sm:justify-end"><button type="button" className="admin-secondary" disabled={busy} onClick={() => onEdit(entry)}>Modifier</button><button type="button" className="admin-secondary" disabled={busy} onClick={() => onToggle(entry)}>{entry.isActive ? 'Masquer' : 'Afficher'}</button><button type="button" className="rounded-lg px-3 py-2 text-xs font-bold text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2" disabled={busy} aria-label={`Supprimer ${entry.title}`} onClick={() => onDelete(entry)}>Supprimer</button></div>
      </article>)}
    </div>
  </section>;
}
