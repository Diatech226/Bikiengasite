import React, { useState } from 'react';

interface AgriculturalGuideModalProps {
  onClose: () => void;
}

export const AgriculturalGuideModal: React.FC<AgriculturalGuideModalProps> = ({ onClose }) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="w-full max-w-xl bg-[#f3fbf5] rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border border-[#c1c8c2] animate-in fade-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#012d1d] text-white">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffca98] text-[20px]">
              download_for_offline
            </span>
            <span className="font-label-md text-xs font-semibold tracking-wide text-[#ffdcbd]">
              Document Pratique • Nagréogo 2024
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer le guide"
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">
          <div className="border-b border-[#dce5de] pb-3">
            <span className="font-label-sm text-[11px] font-bold text-[#7d562d] uppercase tracking-wider">
              Manuel de Régénération Agropastorale
            </span>
            <h2 className="font-headline-sm text-xl text-[#012d1d] font-bold mt-1">
              Fiche Technique Agricole 2024
            </h2>
            <p className="font-body-sm text-xs text-[#414844] mt-1">
              Protocole de restauration des terres latéritiques arides initié par le Cheick Bikienga Seydou.
            </p>
          </div>

          {/* Key sections */}
          <div className="space-y-4 text-sm text-[#151d1a]">
            {/* 1. Zaï Pit Specs */}
            <div className="p-3.5 rounded-xl bg-[#e7f0ea] border border-[#c1ecd4]">
              <div className="flex items-center gap-2 text-[#012d1d] font-bold font-headline-sm text-sm">
                <span className="material-symbols-outlined text-[#7d562d]">straighten</span>
                <span>1. Dimensions & Densité de la cuvette Zaï</span>
              </div>
              <ul className="mt-2 space-y-1.5 text-xs text-[#414844] list-disc pl-4 font-body-sm">
                <li><strong>Diamètre de la fosse :</strong> 30 à 40 cm de circonférence.</li>
                <li><strong>Profondeur :</strong> 15 cm pour retenir l'eau de ruissellement et le limon.</li>
                <li><strong>Espacement :</strong> 70 à 80 cm entre les trous et 1 m entre les lignes (~10 000 poquets/ha).</li>
                <li><strong>Bourrelet de terre :</strong> Disposé en demi-lune en aval de la pente.</li>
              </ul>
            </div>

            {/* 2. Compost Dosing */}
            <div className="p-3.5 rounded-xl bg-[#ffdcbd]/40 border border-[#ffca98]">
              <div className="flex items-center gap-2 text-[#7a532a] font-bold font-headline-sm text-sm">
                <span className="material-symbols-outlined text-[#7d562d]">eco</span>
                <span>2. Formulation du Compost Organique Sahélien</span>
              </div>
              <p className="mt-1 text-xs text-[#414844] font-body-sm leading-relaxed">
                Apport moyen de <strong>300g de fumier bien mûr</strong> (mélange déjections bovines, fanes d'arachide décomposées et cendres de bois) par cuvette avant la première pluie d'hivernage. Ce substrat attire les termites <em>Trinervitermes</em> qui creusent des galeries améliorant la porosité du sol de 300%.
              </p>
            </div>

            {/* 3. Sowing Calendar */}
            <div className="p-3.5 rounded-xl bg-[#edf6ef] border border-[#dce5de]">
              <div className="flex items-center gap-2 text-[#012d1d] font-bold font-headline-sm text-sm">
                <span className="material-symbols-outlined text-[#7d562d]">calendar_month</span>
                <span>3. Calendrier Phénologique au Burkina Faso</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-white border border-[#c1c8c2]">
                  <span className="font-bold text-[#7d562d] block">Mai - Juin</span>
                  <span className="text-[#414844]">Creusement Zaï et mise en place du compost sec.</span>
                </div>
                <div className="p-2 rounded bg-white border border-[#c1c8c2]">
                  <span className="font-bold text-[#012d1d] block">Juin - Juillet</span>
                  <span className="text-[#414844]">Semis direct (sorgho blanc, mil et niébé intercalaire).</span>
                </div>
                <div className="p-2 rounded bg-white border border-[#c1c8c2]">
                  <span className="font-bold text-[#7d562d] block">Août</span>
                  <span className="text-[#414844]">Désherbage sélectif et buttage des plants.</span>
                </div>
                <div className="p-2 rounded bg-white border border-[#c1c8c2]">
                  <span className="font-bold text-[#012d1d] block">Octobre - Novembre</span>
                  <span className="text-[#414844]">Récolte et stockage sécurisé au grenier solidaire.</span>
                </div>
              </div>
            </div>

            {/* 4. Agroforestry Trees */}
            <div className="p-3.5 rounded-xl bg-[#e2eae4]">
              <div className="flex items-center gap-2 text-[#012d1d] font-bold font-headline-sm text-sm">
                <span className="material-symbols-outlined text-[#7d562d]">forest</span>
                <span>4. Arbres Fertilitaires Associés</span>
              </div>
              <p className="mt-1 text-xs text-[#414844] font-body-sm leading-relaxed">
                Association obligatoire avec <strong>Faidherbia albida</strong> (Acacia qui perd ses feuilles en hivernage pour laisser passer le soleil et libère de l'azote organique directement assimilable par les céréales).
              </p>
            </div>
          </div>

          {/* Download Notification */}
          {downloadSuccess && (
            <div className="p-3 rounded-xl bg-[#c1ecd4] text-[#002114] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span>Fiche Technique téléchargée avec succès sur votre appareil (PDF Illustré 2.4 Mo).</span>
            </div>
          )}

          {/* Action button */}
          <div className="pt-2 flex items-center justify-between border-t border-[#dce5de]">
            <div className="flex items-center gap-1.5 text-xs text-[#414844]">
              <span className="material-symbols-outlined text-[16px] text-red-600">
                picture_as_pdf
              </span>
              <span>Édition Officielle • 2.4 Mo</span>
            </div>

            <button
              onClick={handleDownload}
              className="px-4 py-2.5 rounded-full bg-[#012d1d] text-white font-label-md text-xs font-semibold hover:bg-[#1b4332] flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>{downloadSuccess ? 'Téléchargé !' : 'Télécharger le PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
