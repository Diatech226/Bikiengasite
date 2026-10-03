import { useEffect, useId, useState } from 'react';

const isHttpUrl = (value: string) => {
  if (!value) return true;
  try { return ['http:', 'https:'].includes(new URL(value).protocol); } catch { return false; }
};

export function MediaImageField({ url, alt, onUrlChange, onAltChange }: { url: string; alt: string; onUrlChange: (value: string) => void; onAltChange: (value: string) => void }) {
  const id = useId();
  const [loadFailed, setLoadFailed] = useState(false);
  const valid = isHttpUrl(url);
  useEffect(() => setLoadFailed(false), [url]);
  return <fieldset className="grid gap-4 rounded-xl border border-gray-200 p-4 md:col-span-2 md:grid-cols-2">
    <legend className="px-2 text-sm font-bold">Image du média</legend>
    <div className="space-y-4">
      <label htmlFor={`${id}-url`} className="block text-xs font-bold">URL de l’image</label>
      <input id={`${id}-url`} className="admin-input" type="url" inputMode="url" maxLength={2048} value={url} aria-invalid={!valid} aria-describedby={!valid ? `${id}-error` : undefined} placeholder="https://…" onChange={(event) => onUrlChange(event.target.value)} />
      {!valid && <p id={`${id}-error`} role="alert" className="text-sm font-semibold text-red-700">Saisissez une URL HTTP ou HTTPS valide.</p>}
      <label htmlFor={`${id}-alt`} className="block text-xs font-bold">Texte alternatif</label>
      <input id={`${id}-alt`} className="admin-input" type="text" maxLength={240} value={alt} onChange={(event) => onAltChange(event.target.value)} />
    </div>
    <div className="grid min-h-40 place-items-center overflow-hidden rounded-xl bg-gray-100 text-center text-sm text-gray-600">
      {!url ? <span>Aucune image sélectionnée.</span> : !valid || loadFailed ? <span role="status">Impossible de charger cette image.</span> : <img src={url} alt={alt || 'Aperçu du média'} className="h-48 w-full object-cover" onError={() => setLoadFailed(true)} />}
    </div>
  </fieldset>;
}

