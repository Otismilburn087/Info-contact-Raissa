import React from 'react';
import { Language } from '../types';
import { soundFX } from '../utils/audio';

interface Props {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LanguageSelector: React.FC<Props> = ({ language, onLanguageChange }) => {
  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'mg', label: 'Malagasy', flag: '🇲🇬' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  return (
    <div id="language-selector" className="inline-flex p-1 bg-white/[0.08] backdrop-blur-xl rounded-full border border-white/15 shadow-lg shadow-black/20">
      {languages.map((lang) => {
        const isActive = language === lang.code;
        return (
          <button
            key={lang.code}
            id={`lang-btn-${lang.code}`}
            type="button"
            onClick={() => {
              soundFX.playTap();
              if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(20);
              }
              onLanguageChange(lang.code);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-1.5 cursor-pointer select-none ${
              isActive
                ? 'bg-gradient-to-r from-emerald-500/90 to-teal-500/90 text-white shadow-md shadow-emerald-950/50 border border-white/25'
                : 'text-slate-300/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
          </button>
        );
      })}
    </div>
  );
};
