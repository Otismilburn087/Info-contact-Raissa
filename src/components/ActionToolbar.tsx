import React, { useState } from 'react';
import { UserPlus, QrCode, Share2, Sparkles, Check, Send } from 'lucide-react';
import { ContactInfo, Language } from '../types';
import { downloadVCard } from '../data/contactData';
import { soundFX } from '../utils/audio';
import confetti from 'canvas-confetti';

interface Props {
  contact: ContactInfo;
  language: Language;
  onOpenQR: () => void;
  onOpenQuickMessage: () => void;
}

export const ActionToolbar: React.FC<Props> = ({
  contact,
  language,
  onOpenQR,
  onOpenQuickMessage,
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isShared, setIsShared] = useState(false);

  const handleSaveContact = async () => {
    soundFX.playSuccess();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
    await downloadVCard(contact);
    setIsSaved(true);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#10b981', '#14b8a6', '#06b6d4', '#f59e0b', '#ef4444', '#ffffff'],
    });
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleShare = async () => {
    soundFX.playTap();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(30);
    }
    const titleText = language === 'mg'
      ? `${contact.fullName} - ${contact.officialTitleMg}`
      : language === 'fr'
      ? `${contact.fullName} - ${contact.officialTitleFr}`
      : `${contact.fullName} - ${contact.officialTitleEn}`;

    const shareData = {
      title: titleText,
      text: titleText,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Fallback to clipboard
        copyPageUrl();
      }
    } else {
      copyPageUrl();
    }
  };

  const copyPageUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsShared(true);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.75 },
      colors: ['#10b981', '#06b6d4', '#ffffff'],
    });
    setTimeout(() => setIsShared(false), 2500);
  };

  return (
    <section id="action-toolbar" className="w-full space-y-3">
      {/* Primary Big Action: Save Contact */}
      <button
        id="save-contact-vcf-btn"
        type="button"
        onClick={handleSaveContact}
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:via-teal-300 hover:to-cyan-300 text-slate-950 font-extrabold text-base sm:text-lg flex items-center justify-center gap-3 shadow-xl shadow-emerald-950/40 hover:shadow-2xl border border-white/40 backdrop-blur-xl transition-all duration-300 transform active:scale-[0.98] cursor-pointer group"
      >
        {isSaved ? (
          <>
            <Check className="w-6 h-6 text-slate-950 animate-bounce" />
            <span>
              {language === 'mg'
                ? 'Voatahiry ao amin\'ny Finday!'
                : language === 'fr'
                ? 'Contact Enregistré (.VCF) !'
                : 'Contact Saved (.VCF)!'}
            </span>
          </>
        ) : (
          <>
            <UserPlus className="w-6 h-6 text-slate-950 group-hover:scale-110 transition-transform duration-200" />
            <span>
              {language === 'mg'
                ? 'Tehirizo anaty Finday ny Contact (.VCF)'
                : language === 'fr'
                ? 'Enregistrer dans vos Contacts (.VCF)'
                : 'Save Contact to Phone (.VCF)'}
            </span>
            <Sparkles className="w-5 h-5 text-slate-950/80 group-hover:rotate-12 transition-transform" />
          </>
        )}
      </button>

      {/* Grid of secondary tools with Frosted Glass look */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Quick Message */}
        <button
          id="quick-message-btn"
          type="button"
          onClick={() => {
            soundFX.playTap();
            onOpenQuickMessage();
          }}
          className="p-3.5 rounded-2xl bg-white/[0.07] hover:bg-white/[0.14] border border-white/15 hover:border-white/30 backdrop-blur-2xl text-slate-100 flex flex-col items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-lg shadow-black/20 group active:scale-95"
        >
          <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-400/30 group-hover:bg-teal-500/30 group-hover:scale-105 transition-all backdrop-blur-md">
            <Send className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-100 text-center leading-tight">
            {language === 'mg' ? 'Handefa Hafatra' : language === 'fr' ? 'Écrire un Message' : 'Quick Message'}
          </span>
        </button>

        {/* QR Code */}
        <button
          id="qr-code-btn"
          type="button"
          onClick={() => {
            soundFX.playTap();
            onOpenQR();
          }}
          className="p-3.5 rounded-2xl bg-white/[0.07] hover:bg-white/[0.14] border border-white/15 hover:border-white/30 backdrop-blur-2xl text-slate-100 flex flex-col items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-lg shadow-black/20 group active:scale-95"
        >
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 group-hover:bg-emerald-500/30 group-hover:scale-105 transition-all backdrop-blur-md">
            <QrCode className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-100 text-center leading-tight">
            {language === 'mg' ? 'Kaody QR' : language === 'fr' ? 'Code QR' : 'QR Code'}
          </span>
        </button>

        {/* Share */}
        <button
          id="share-link-btn"
          type="button"
          onClick={handleShare}
          className="p-3.5 rounded-2xl bg-white/[0.07] hover:bg-white/[0.14] border border-white/15 hover:border-white/30 backdrop-blur-2xl text-slate-100 flex flex-col items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-lg shadow-black/20 group active:scale-95"
        >
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30 group-hover:bg-blue-500/30 group-hover:scale-105 transition-all backdrop-blur-md">
            {isShared ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
          </div>
          <span className="text-xs font-bold text-slate-100 text-center leading-tight">
            {isShared
              ? language === 'mg'
                ? 'Voazara!'
                : language === 'fr'
                ? 'Partagé !'
                : 'Shared!'
              : language === 'mg'
              ? 'Hizara Rohy'
              : language === 'fr'
              ? 'Partager'
              : 'Share Link'}
          </span>
        </button>
      </div>
    </section>
  );
};
