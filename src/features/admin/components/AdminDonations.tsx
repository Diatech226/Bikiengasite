import { useCallback, useEffect, useState } from 'react';
import { contentApi, MediaItem } from '../../../services/contentApi';
import { Donation, donationApi, DonationStatus } from '../../../services/donationApi';

const statuses: DonationStatus[] = ['PENDING', 'CONTACTED', 'CONFIRMED', 'RECEIVED', 'CANCELLED'];
const labels: Record<DonationStatus, string> = { PENDING: 'En attente', CONTACTED: 'Contacté', CONFIRMED: 'Confirmé', RECEIVED: 'Reçu', CANCELLED: 'Annulé' };

interface Props { onChanged: () => void; notify: (value: string) => void }

export function AdminDonations({ onChanged, notify }: Props) {
  const [data, setData] = useState<Donation[]>([]);
  const [projects, setProjects] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [projectSlug, setProjectSlug] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await donationApi.admin.list({ page, limit: 20, status: status as DonationStatus | '', type, projectSlug, from, to });
      setData(result.data);
      setPages(result.meta.totalPages);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Chargement impossible');
    } finally {
      setLoading(false);
    }
  }, [page, status, type, projectSlug, from, to]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    void contentApi.admin()
      .then((payload) => setProjects(payload.mediaItems.filter((item) => item.type === 'projet')))
      .catch(() => undefined);
  }, []);

  const change = async (id: string, value: DonationStatus) => {
    try {
      await donationApi.admin.status(id, value);
      notify('Statut du soutien mis à jour');
      await load();
      onChanged();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Mise à jour impossible');
    }
  };

  return <AdminList
    title="Dons et soutiens de chantier"
    loading={loading}
    error={error}
    empty={!data.length}
    onRefresh={() => void load()}
    filters={<>
      <select aria-label="Filtrer par statut" value={status} onChange={(event) => { setPage(1); setStatus(event.target.value); }}><option value="">Tous les statuts</option>{statuses.map((value) => <option key={value} value={value}>{labels[value]}</option>)}</select>
      <select aria-label="Filtrer par chantier" value={projectSlug} onChange={(event) => { setPage(1); setProjectSlug(event.target.value); }}><option value="">Tous les chantiers</option>{projects.map((project) => <option key={project.slug} value={project.slug}>{project.title}</option>)}</select>
      <input aria-label="Filtrer par type" placeholder="Type (forage, matériel…)" value={type} onChange={(event) => { setPage(1); setType(event.target.value); }} />
      <input aria-label="Date de début" type="date" value={from} onChange={(event) => { setPage(1); setFrom(event.target.value); }} />
      <input aria-label="Date de fin" type="date" min={from || undefined} value={to} onChange={(event) => { setPage(1); setTo(event.target.value); }} />
    </>}
    pagination={<Pagination page={page} pages={pages} setPage={setPage} />}
  >
    {data.map((donation) => <article key={donation.id} className="admin-row"><div><strong>{donation.donorName}</strong>{donation.projectTitle && <p className="font-semibold text-[#7d562d]">Chantier : {donation.projectTitle}</p>}<p>{donation.donorContact}{donation.donorEmail ? ` · ${donation.donorEmail}` : ''}</p><p>{donation.type} · {donation.amount != null ? `${donation.amount.toLocaleString('fr-FR')} ${donation.currency}` : 'Don en nature / montant non précisé'}</p>{donation.message && <p className="italic">{donation.message}</p>}</div><div><time>{new Date(donation.createdAt).toLocaleDateString('fr-FR')}</time><select aria-label={`Statut de ${donation.donorName}`} value={donation.status} onChange={(event) => void change(donation.id, event.target.value as DonationStatus)}>{statuses.map((value) => <option key={value} value={value}>{labels[value]}</option>)}</select></div></article>)}
  </AdminList>;
}

export function AdminList({ title, loading, error, empty, onRefresh, filters, pagination, children }: { title: string; loading: boolean; error: string; empty: boolean; onRefresh: () => void; filters: React.ReactNode; pagination: React.ReactNode; children: React.ReactNode }) {
  return <section className="flex flex-col gap-4"><div className="flex justify-between"><h2 className="text-xl font-bold text-[#012d1d]">{title}</h2><button onClick={onRefresh} className="admin-button">Actualiser</button></div><div className="admin-filters">{filters}</div>{error && <p role="alert" className="admin-error">{error}</p>}{loading ? <p className="admin-state">Chargement…</p> : empty ? <p className="admin-state">Aucun élément à afficher.</p> : <div className="flex flex-col gap-3">{children}</div>}{pagination}</section>;
}

export function Pagination({ page, pages, setPage }: { page: number; pages: number; setPage: (page: number) => void }) {
  if (pages <= 1) return null;
  return <div className="flex justify-center items-center gap-3"><button className="admin-button" disabled={page <= 1} onClick={() => setPage(page - 1)}>Précédent</button><span className="text-xs">Page {page} / {pages}</span><button className="admin-button" disabled={page >= pages} onClick={() => setPage(page + 1)}>Suivant</button></div>;
}
