/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { contactData } from './data/contactData';
import { Language } from './types';
import { HeaderBanner } from './components/HeaderBanner';
import { ContactCardList } from './components/ContactCardList';
import { ActionToolbar } from './components/ActionToolbar';
import { LanguageSelector } from './components/LanguageSelector';
import { QuickMessageModal } from './components/QuickMessageModal';
import { QRCodeModal } from './components/QRCodeModal';
import { ShieldCheck } from 'lucide-react';
import ministryLogoImg from './assets/images/ministry_logo_1787667381324.jpg';

export default function App() {
  const [language, setLanguage] = useState<Language>('mg');
  const [isQuickMessageOpen, setIsQuickMessageOpen] = useState(false);
  const [quickMessageChannel, setQuickMessageChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [isQROpen, setIsQROpen] = useState(false);

  const handleOpenQuickMessage = (defaultChannel: 'whatsapp' | 'email' = 'whatsapp') => {
    setQuickMessageChannel(defaultChannel);
    setIsQuickMessageOpen(true);
  };

  const getCountryName = () => {
    if (language === 'mg') return 'Madagasikara';
    return 'Madagascar';
  };

  const getMinistryName = () => {
    if (language === 'mg') return contactData.ministryMg;
    if (language === 'fr') return contactData.ministryFr;
    return contactData.ministryEn;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#070e22] to-slate-950 text-slate-100 flex flex-col items-center justify-between p-3 sm:p-6 selection:bg-teal-400 selection:text-slate-950 font-sans relative overflow-x-hidden">
      {/* Background layer: Ministry Logo watermark & ambient frosted glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
        {/* Soft atmospheric color orbs */}
        <div className="absolute -top-32 -left-32 w-[30rem] h-[30rem] rounded-full bg-emerald-500/15 blur-[130px] animate-pulse" />
        <div className="absolute top-1/4 -right-32 w-[28rem] h-[28rem] rounded-full bg-teal-500/15 blur-[130px]" />
        <div className="absolute top-2/3 -left-20 w-[26rem] h-[26rem] rounded-full bg-indigo-500/10 blur-[140px]" />
        <div className="absolute -bottom-32 right-1/4 w-[32rem] h-[32rem] rounded-full bg-rose-500/10 blur-[150px]" />

        {/* Ministry Official Logo Watermark in Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] sm:w-[40rem] sm:h-[40rem] opacity-10 mix-blend-screen pointer-events-none select-none">
          <img
            src={ministryLogoImg}
            alt="Ministère de l'Intérieur et de la Décentralisation"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain filter grayscale contrast-125"
          />
        </div>
      </div>

      {/* Main Container Card */}
      <main className="relative z-10 w-full max-w-lg mx-auto my-2 sm:my-6 space-y-5">
        {/* Top Control Bar with Country Flag & Language Selector */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            {/* Madagascar Emblem / Frosted Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.08] border border-white/15 backdrop-blur-xl shadow-lg shadow-black/20">
              <span className="text-base leading-none" role="img" aria-label="Madagascar Flag">
                🇲🇬
              </span>
              <span className="text-[11px] font-bold tracking-wider text-white/90 uppercase">
                {getCountryName()}
              </span>
            </div>
          </div>

          <LanguageSelector language={language} onLanguageChange={setLanguage} />
        </div>

        {/* Profile Card Header */}
        <HeaderBanner contact={contactData} language={language} />

        {/* Primary Action Tools (Save VCF, Message, QR, Share) */}
        <ActionToolbar
          contact={contactData}
          language={language}
          onOpenQR={() => setIsQROpen(true)}
          onOpenQuickMessage={() => handleOpenQuickMessage('whatsapp')}
        />

        {/* Contact Links & Direct Channels */}
        <ContactCardList
          contact={contactData}
          language={language}
          onOpenQuickMessage={handleOpenQuickMessage}
        />

        {/* Official Accreditation Footer Card */}
        <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/15 text-center space-y-2 backdrop-blur-2xl shadow-xl shadow-black/25">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {language === 'mg'
                ? 'Repoblikan\'i Madagasikara — Tanindrazana, Fahafahana, Fandrosoana'
                : language === 'fr'
                ? 'République de Madagascar — Patrie, Liberté, Progrès'
                : 'Republic of Madagascar — Homeland, Liberty, Progress'}
            </span>
          </div>
          <p className="text-[11px] text-slate-300/90 leading-relaxed max-w-sm mx-auto">
            {language === 'mg'
              ? 'Ity pejy fifandraisana ity dia natokana ho an\'ny fifandraisana ara-panjakana sy matihanina amin\'ny Sekreteran\'ny Minisitera.'
              : language === 'fr'
              ? 'Ce profil de contact officiel est destiné aux correspondances administratives et professionnelles avec le Secrétariat du Ministère.'
              : 'This official contact profile is dedicated to administrative and professional correspondence with the Ministry Secretariat.'}
          </p>
        </div>

        {/* Simple Footer */}
        <footer className="pt-2 pb-6 text-center text-xs text-slate-400 space-y-1">
          <p className="flex items-center justify-center gap-1 text-[11px]">
            <span>
              {language === 'mg'
                ? 'Novolavolaina ho an\'i'
                : language === 'fr'
                ? 'Conçu pour'
                : 'Designed for'}
            </span>
            <strong className="text-white/90 font-semibold">{contactData.fullName}</strong>
          </p>
          <p className="text-[10px] text-slate-400/80">
            {getMinistryName()}
          </p>
        </footer>
      </main>

      {/* Modals */}
      <QuickMessageModal
        isOpen={isQuickMessageOpen}
        onClose={() => setIsQuickMessageOpen(false)}
        contact={contactData}
        language={language}
        defaultChannel={quickMessageChannel}
      />

      <QRCodeModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
        contact={contactData}
        language={language}
      />
    </div>
  );
}
