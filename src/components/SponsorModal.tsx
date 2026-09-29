import React, { useState } from 'react';

interface SponsorModalProps {
  onClose: () => void;
}

export const SponsorModal: React.FC<SponsorModalProps> = ({ onClose }) => {
  const [selectedOption, setSelectedOption] = useState<'genisse' | 'belier' | 'soins'>('genisse');
  const [sponsorName, setSponsorName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const options = [
    {
      id: 'genisse' as const,
      title: 'Génisse Laitière Azawak',
      cost: '450 000 FCFA (~685 €)',
      desc: 'Confie une jeune vache laitière à une famille vulnérable de Nagréogo. Le premier veau femelle est ensuite transmis à une seconde famille.',
      icon: 'cruelty_free',
      tag: 'Impact Générationnel',
    },
    {
      id: 'belier' as const,
      title: 'Bélier Reproducteur Djallonké',
      cost: '120 000 FCFA (~183 €)',
      desc: 'Améliore la vigueur génétique du cheptel ovin sahélien résistant aux parasitoses et enrichit le capital des éleveurs locaux.',
      icon: 'pets',
      tag: 'Vigueur Génétique',
    },
    {
      id: 'soins' as const,
      title: 'Pack Sanitaire & Vaccins (5 têtes)',
      cost: '35 000 FCFA (~53 €)',
      desc: 'Financement du déparasitage complet, vaccination contre la péripneumonie et suivi par le vétérinaire de Nagréogo pendant 1 an.',
      icon: 'medical_services',
      tag: 'Soins Annuels',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsorName.trim()) return;
    setIsSubmitted(true);
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
              volunteer_activism
            </span>
            <span className="font-label-md text-xs font-semibold tracking-wide text-[#ffdcbd]">
              Parrainage Pastoral • Cheptel Sahélien
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer le parrainage"
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">
          {!isSubmitted ? (
            <>
              <div>
                <span className="font-label-sm text-[11px] font-bold text-[#7d562d] uppercase tracking-wider">
                  Solidarité Animale & Sécurité Pastorale
                </span>
                <h2 className="font-headline-sm text-xl text-[#012d1d] font-bold mt-1">
                  Parrainer un animal à Nagréogo
                </h2>
                <p className="font-body-sm text-xs text-[#414844] mt-1">
                  Offrez une source durable de lait, de fumure organique et de dignité à un foyer rural sous la bénédiction et le suivi du Cheick Bikienga Seydou.
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {options.map((opt) => {
                  const isSelected = selectedOption === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedOption(opt.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#edf6ef] border-[#012d1d] shadow-sm'
                          : 'bg-white border-[#dce5de] hover:border-[#7d562d]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isSelected
                                ? 'bg-[#012d1d] text-white'
                                : 'bg-[#e7f0ea] text-[#012d1d]'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {opt.icon}
                            </span>
                          </span>
                          <div>
                            <h3 className="font-headline-sm text-sm text-[#012d1d] font-bold">
                              {opt.title}
                            </h3>
                            <span className="font-label-sm text-[11px] text-[#7d562d] font-bold">
                              {opt.cost}
                            </span>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-full bg-[#ffca98] text-[#7a532a] text-[10px] font-bold">
                          {opt.tag}
                        </span>
                      </div>
                      <p className="text-xs text-[#414844] mt-2 pl-10 font-body-sm leading-relaxed">
                        {opt.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 pt-2">
                <div>
                  <label className="font-label-sm text-xs font-semibold text-[#012d1d] block mb-1">
                    Votre Nom Complet / Organisme *
                  </label>
                  <input
                    type="text"
                    required
                    value={sponsorName}
                    onChange={(e) => setSponsorName(e.target.value)}
                    placeholder="Ex: Idrissa Compaoré ou Famille Diallo"
                    className="w-full h-11 px-3 rounded-lg border border-[#c1c8c2] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7d562d]"
                  />
                </div>

                <div>
                  <label className="font-label-sm text-xs font-semibold text-[#012d1d] block mb-1">
                    Numéro de Téléphone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+226 70 00 00 00 ou international"
                    className="w-full h-11 px-3 rounded-lg border border-[#c1c8c2] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7d562d]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-[#7d562d] text-white font-label-md text-sm font-bold shadow-md hover:bg-[#623f18] transition-all flex items-center justify-center gap-2 mt-1 active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                  <span>Confirmer mon engagement de parrainage</span>
                </button>
              </form>
            </>
          ) : (
            /* Confirmation Certificate */
            <div className="p-4 rounded-2xl bg-white border border-[#c1ecd4] shadow-sm flex flex-col gap-4 text-center items-center py-6 animate-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-[#c1ecd4] text-[#002114] flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px]">check</span>
              </div>

              <div>
                <span className="font-label-sm text-[11px] text-[#7d562d] uppercase tracking-wider font-bold">
                  Attestation Provisoire de Parrainage
                </span>
                <h3 className="font-headline-sm text-xl text-[#012d1d] font-bold mt-1">
                  Barakallahou fik, {sponsorName} !
                </h3>
                <p className="font-body-sm text-xs text-[#414844] mt-1 max-w-sm mx-auto">
                  Votre engagement pour <strong>{options.find((o) => o.id === selectedOption)?.title}</strong> a été transmis à la cellule pastorale de Nagréogo.
                </p>
              </div>

              <div className="p-3 bg-[#edf6ef] rounded-xl text-left w-full text-xs space-y-1 text-[#414844]">
                <p><strong>Bénéficiaire :</strong> Famille attribuée par le comité des sages</p>
                <p><strong>Suivi sanitaire :</strong> Vétérinaire communal Nagréogo</p>
                <p><strong>Contact :</strong> {phone || 'Non renseigné'}</p>
                <p><strong>Statut :</strong> En cours d'attribution et préparation vétérinaire</p>
              </div>

              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-[#012d1d] text-white font-label-md text-xs font-semibold hover:bg-[#1b4332] transition-colors"
              >
                Retour à l'application
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
