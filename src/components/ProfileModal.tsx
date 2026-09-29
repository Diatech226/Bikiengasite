import React from 'react';
import { APP_ASSETS } from '../data/content';

interface ProfileModalProps {
  onClose: () => void;
  onOpenDonation: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ onClose, onOpenDonation }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="w-full max-w-xl bg-[#f3fbf5] rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border border-[#c1c8c2] animate-in fade-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-[#012d1d] text-white p-6 pb-12 flex flex-col items-center text-center">
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          <span className="font-label-sm text-[11px] text-[#ffdcbd] uppercase tracking-widest font-bold">
            Notice Biographique & Vision
          </span>
          <h2 className="font-headline-md text-2xl font-bold mt-1 text-[#c1ecd4]">
            Cheick Bikienga Seydou
          </h2>
          <p className="font-body-sm text-xs text-white/80 mt-1">
            Guide Spirituel, Bâtisseur & Pionnier Agropastoral de Nagréogo
          </p>
        </div>

        {/* Floating Avatar & Body */}
        <div className="relative px-6 pb-6 pt-0 flex flex-col gap-4 -mt-10 overflow-y-auto">
          <div className="flex justify-center">
            <img
              src={APP_ASSETS.profile}
              alt="Portrait officiel de Cheick Bikienga"
              className="w-20 h-20 rounded-full object-cover border-4 border-[#f3fbf5] shadow-lg"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Quote */}
          <div className="p-3.5 rounded-xl bg-[#ffdcbd]/30 border-l-4 border-[#7d562d]">
            <p className="font-headline-md italic text-xs text-[#012d1d] leading-relaxed">
              « Nourrir les âmes, cultiver la terre et tendre la main : la vraie foi s'enracine dans la bienfaisance envers les créatures de Dieu. »
            </p>
          </div>

          {/* Biography text */}
          <div className="font-body-md text-xs text-[#414844] space-y-3 leading-relaxed">
            <p>
              Natif de la région du Plateau-Central au Burkina Faso, le <strong>Cheick Seydou Bikienga</strong> a conjugué très tôt une formation théologique islamique exigeante et un attachement viscéral à la terre sahélienne.
            </p>
            <p>
              Face à la désertification et à la précarité des campagnes, il a impulsé à <strong>Nagréogo</strong> une démarche globale de développement endogène :
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-lg bg-white border border-[#dce5de]">
                <strong className="text-[#012d1d] block">Pôle Agricole</strong>
                <span>Régénération par Zaï motorisé, maraîchage solaire et agroforesterie.</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-[#dce5de]">
                <strong className="text-[#7d562d] block">Pôle Pastoral</strong>
                <span>Sélection des zébus Azawak, embouche saine et mini-laiteries.</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-[#dce5de]">
                <strong className="text-[#012d1d] block">Hydraulique Villageoise</strong>
                <span>38 forages et châteaux d'eau solaires offrant l'eau potable gratuite.</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-[#dce5de]">
                <strong className="text-[#7d562d] block">Éducation & Partage</strong>
                <span>Banques de céréales contre la soudure et bourses pour orphelins.</span>
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="pt-2 flex items-center justify-between border-t border-[#dce5de]">
            <span className="text-[11px] text-[#717973]">Localisation : Nagréogo, Oubritenga</span>
            <button
              onClick={() => {
                onClose();
                onOpenDonation();
              }}
              className="px-4 py-2 rounded-full bg-[#012d1d] text-white font-label-md text-xs font-semibold hover:bg-[#1b4332] transition-colors"
            >
              Agir aux côtés du Cheick
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
