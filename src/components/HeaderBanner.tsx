import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, MapPin, Sparkles, X, ZoomIn } from 'lucide-react';
import { ContactInfo, Language } from '../types';
import profileImg from '../assets/images/raissa_portrait_original_1787667852794.jpg';
import { soundFX } from '../utils/audio';

interface Props {
  contact: ContactInfo;
  language: Language;
}

export const HeaderBanner: React.FC<Props> = ({ contact, language }) => {
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [isOpenNow, setIsOpenNow] = useState(true);

  // Check if current time is between 9:00 AM (09:00) and 4:00 PM (16:00) in Madagascar time (UTC+3)
  useEffect(() => {
    const checkOfficeStatus = () => {
      const now = new Date();
      // Madagascar is UTC+3
      const utcHours = now.getUTCHours();
      const localMadagascarHours = (utcHours + 3) % 24;
      // Between 09:00 and 15:59:59 (9h00 to 16h00)
      const open = localMadagascarHours >= 9 && localMadagascarHours < 16;
      setIsOpenNow(open);
    };

    checkOfficeStatus();
    const interval = setInterval(checkOfficeStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const getTitle = () => {
    if (language === 'mg') return contact.officialTitleMg;
    if (language === 'fr') return contact.officialTitleFr;
    return contact.officialTitleEn;
  };

  const getMinistry = () => {
    if (language === 'mg') return contact.ministryMg;
    if (language === 'fr') return contact.ministryFr;
    return contact.ministryEn;
  };

  const getLocation = () => {
    if (language === 'mg') return 'Anosy, Antananarivo, Madagasikara';
    if (language === 'fr') return 'Anosy, Antananarivo, Madagascar';
    return 'Anosy, Antananarivo, Madagascar';
  };

  const getStatusText = () => {
    if (isOpenNow) {
      if (language === 'mg') return 'Malalaka handray antso';
      if (language === 'fr') return 'Secrétariat Ouvert';
      return 'Office Open';
    } else {
      if (language === 'mg') return 'Mikatona ny birao';
      if (language === 'fr') return 'Secrétariat Fermé';
      return 'Office Closed';
    }
  };

  return (
    <header id="profile-header" className="relative w-full overflow-hidden rounded-3xl bg-white/[0.07] border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] backdrop-blur-2xl">
      {/* Madagascar Flag Accent Stripe */}
      <div className="w-full h-2 flex">
        <div className="w-1/3 bg-white" title="Madagascar White" />
        <div className="w-1/3 bg-red-600" title="Madagascar Red" />
        <div className="w-1/3 bg-emerald-600" title="Madagascar Green" />
      </div>

      {/* Top Status Bar (Dynamic time-based status, without showing hours) */}
      <div className="flex items-center justify-end px-5 pt-4">
        <div
          id="office-status-badge"
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-xl border text-xs font-semibold shadow-md transition-all duration-300 ${
            isOpenNow
              ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300'
              : 'bg-slate-800/60 border-slate-700 text-slate-300'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full inline-block ${
              isOpenNow ? 'bg-emerald-400 animate-ping' : 'bg-slate-400'
            }`}
          />
          <span>{getStatusText()}</span>
        </div>
      </div>

      {/* Main Profile Content */}
      <div className="relative px-5 sm:px-8 pb-7 pt-2 flex flex-col items-center text-center">
        {/* Avatar with Glow and Zoom Button */}
        <div className="relative group mb-4">
          <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-emerald-400 via-teal-300 to-cyan-400 opacity-80 blur-md group-hover:opacity-100 transition duration-500 animate-pulse" />
          
          <button
            id="avatar-zoom-btn"
            type="button"
            onClick={() => {
              soundFX.playTap();
              setShowPhotoModal(true);
            }}
            className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-slate-950/80 backdrop-blur-md border-2 border-white/30 overflow-hidden shadow-2xl transition-transform duration-300 group-hover:scale-[1.02] cursor-pointer"
            title={language === 'mg' ? 'Tsindrio hijerena ny sary lehibe' : language === 'fr' ? 'Agrandir la photo' : 'Enlarge photo'}
          >
            <img
              src={profileImg}
              alt={contact.fullName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-full"
            />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-full text-white">
              <ZoomIn className="w-6 h-6 text-white drop-shadow-md" />
            </div>
          </button>
        </div>

        {/* Name */}
        <div className="space-y-1">
          <h1 id="profile-name" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
            {contact.fullName}
          </h1>
        </div>

        {/* Job Title & Ministry */}
        <div className="mt-3 space-y-2 max-w-lg">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.09] border border-white/15 text-white shadow-inner backdrop-blur-xl">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <p id="profile-title" className="text-xs sm:text-sm font-semibold text-slate-100 leading-snug">
              {getTitle()}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-slate-300/90 pt-1">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-teal-300" />
              <span>{getMinistry()}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-300" />
              <span>{getLocation()}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Modal for full photo inspection */}
      <AnimatePresence>
        {showPhotoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setShowPhotoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-md w-full bg-slate-900/85 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/20 shadow-[0_16px_48px_0_rgba(0,0,0,0.6)] p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-base">{contact.fullName}</span>
                  <span className="text-xs text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-400/30 backdrop-blur-md">MID</span>
                </div>
                <button
                  id="close-photo-modal-btn"
                  type="button"
                  onClick={() => setShowPhotoModal(false)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 transition-colors border border-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-3.5 rounded-2xl overflow-hidden border border-white/15 aspect-square shadow-2xl">
                <img
                  src={profileImg}
                  alt={contact.fullName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-center text-xs text-slate-300/80 mt-3.5">
                {getTitle()} — {getMinistry()}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
