import React, { useState } from 'react';
import { donationApi } from '../services/donationApi';

interface DonationModalProps {
  onClose: () => void;
  defaultCategory?: string;
}

export const DonationModal: React.FC<DonationModalProps> = ({ onClose, defaultCategory }) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [category, setCategory] = useState(defaultCategory || 'forage');
  const [amount, setAmount] = useState('50 000 FCFA');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    { id: 'forage', label: 'Eau Potable & Forage Solaire (Puits N°39)' },
    { id: 'cereales', label: 'Banque de Céréales & Vivres de Soudure' },
    { id: 'orphelins', label: 'Kits Scolaires & Bourses pour Orphelins' },
    { id: 'arbres', label: 'Reboisement & Ceinture Verte (10 000 arbres)' },
    { id: 'materiel', label: 'Don en nature (outils agricoles, semences, panneaux)' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!name.trim() || loading) return; setLoading(true); setError('');
    const numericAmount = Number(amount.replace(/[^0-9]/g, ''));
    try { await donationApi.create({ donorName: name.trim(), donorContact: contact.trim(), type: category, amount: numericAmount || undefined, message: message.trim() || undefined }); setSubmitted(true); }
    catch (err) { setError(err instanceof Error ? err.message : 'La demande n’a pas pu être transmise.'); }
    finally { setLoading(false); }
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
              handshake
            </span>
            <span className="font-label-md text-xs font-semibold tracking-wide text-[#ffdcbd]">
              Solidarité Directe • Nagréogo
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">
          {!submitted ? (
            <>
              <div>
                <span className="font-label-sm text-[11px] font-bold text-[#7d562d] uppercase tracking-wider">
                  Engagement & Fraternité
                </span>
                <h2 className="font-headline-sm text-xl text-[#012d1d] font-bold mt-1">
                  Soutenir une action du Cheick Bikienga
                </h2>
                <p className="font-body-sm text-xs text-[#414844] mt-1">
                  Votre contribution va directement au financement des chantiers communautaires à Nagréogo, sans intermédiaire.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <div>
                  <label className="font-label-sm text-xs font-semibold text-[#012d1d] block mb-1">
                    Projet à soutenir *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-[#c1c8c2] bg-white text-xs font-medium text-[#151d1a] focus:outline-none focus:ring-2 focus:ring-[#7d562d]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-label-sm text-xs font-semibold text-[#012d1d] block mb-1">
                      Votre Nom *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nom et Prénom"
                      className="w-full h-11 px-3 rounded-lg border border-[#c1c8c2] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#7d562d]"
                    />
                  </div>
                  <div>
                    <label className="font-label-sm text-xs font-semibold text-[#012d1d] block mb-1">
                      WhatsApp / Mobile *
                    </label>
                    <input
                      type="tel"
                      required
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="+226 ... / International"
                      className="w-full h-11 px-3 rounded-lg border border-[#c1c8c2] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#7d562d]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-label-sm text-xs font-semibold text-[#012d1d] block mb-1">
                    Montant indicatif ou proposition de don
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['15 000 FCFA', '50 000 FCFA', '150 000 FCFA'].map((val) => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => setAmount(val)}
                        className={`py-2 text-xs font-semibold rounded-lg border text-center transition-colors ${
                          amount === val
                            ? 'bg-[#012d1d] text-white border-[#012d1d]'
                            : 'bg-white text-[#414844] border-[#c1c8c2]'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-label-sm text-xs font-semibold text-[#012d1d] block mb-1">
                    Message / Remarques au secrétariat
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Précisions sur vos souhaits, intentions ou demande d'échange direct..."
                    className="w-full p-2.5 rounded-lg border border-[#c1c8c2] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#7d562d]"
                  />
                </div>

                {error && <p role="alert" className="text-xs font-semibold text-red-700 bg-red-50 p-2 rounded-lg">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 disabled:opacity-60 rounded-xl bg-[#012d1d] text-white font-label-md text-sm font-bold shadow-md hover:bg-[#1b4332] transition-all flex items-center justify-center gap-2 mt-1 active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  <span>{loading ? 'Transmission…' : 'Transmettre mon soutien'}</span>
                </button>
              </form>
            </>
          ) : (
            <div className="p-4 rounded-2xl bg-white border border-[#c1ecd4] shadow-sm flex flex-col gap-4 text-center items-center py-6 animate-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-[#ffca98] text-[#7a532a] flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px]">favorite</span>
              </div>

              <div>
                <span className="font-label-sm text-[11px] text-[#7d562d] uppercase tracking-wider font-bold">
                  Bénédiction & Remerciement
                </span>
                <h3 className="font-headline-sm text-xl text-[#012d1d] font-bold mt-1">
                  Qu'Allah bénisse votre générosité, {name} !
                </h3>
                <p className="font-body-sm text-xs text-[#414844] mt-1 max-w-sm mx-auto">
                  Votre engagement pour <strong>{categories.find((c) => c.id === category)?.label}</strong> ({amount}) a bien été transmis. Le secrétariat humanitaire de Nagréogo prendra attache avec vous sur {contact}.
                </p>
              </div>

              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-[#012d1d] text-white font-label-md text-xs font-semibold hover:bg-[#1b4332] transition-colors"
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
