import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Share2, Check, Phone, Globe, Shield } from 'lucide-react';
import { ContactInfo, Language } from '../types';
import { generateVCardString } from '../data/contactData';
import { soundFX } from '../utils/audio';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  contact: ContactInfo;
  language: Language;
}

export const QRCodeModal: React.FC<Props> = ({ isOpen, onClose, contact, language }) => {
  const [mode, setMode] = useState<'url' | 'vcard'>('url');
  const [isCopied, setIsCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://otismilburn087.github.io/Mes-Contactes/';
  const vcardValue = generateVCardString(contact);
  const qrValue = mode === 'url' ? currentUrl : vcardValue;

  const handleCopyLink = () => {
    soundFX.playTap();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(30);
    }
    navigator.clipboard.writeText(currentUrl);
    setIsCopied(true);
    confetti({
      particleCount: 25,
      spread: 40,
      origin: { y: 0.7 },
      colors: ['#10b981', '#06b6d4', '#ffffff'],
    });
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleDownloadQR = () => {
    soundFX.playSuccess();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(40);
    }
    const svgElement = qrRef.current?.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 600;
      canvas.height = 600;
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 50, 50, 500, 500);

        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `QRCode_${contact.fullName.replace(/\s+/g, '_')}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          className="relative max-w-sm w-full bg-slate-900/85 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/20 shadow-[0_16px_48px_0_rgba(0,0,0,0.6)] p-6 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/15">
            <div className="flex items-center gap-2 text-left">
              <Shield className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="font-bold text-white text-base">
                  {language === 'mg'
                    ? 'Kaody QR Fifandraisana'
                    : language === 'fr'
                    ? 'Code QR de Contact'
                    : 'Contact QR Code'}
                </h3>
                <p className="text-xs text-slate-300/80">{contact.fullName}</p>
              </div>
            </div>
            <button
              id="close-qr-modal-btn"
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 transition-colors border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher: Web Link vs Direct vCard */}
          <div className="mt-4 flex p-1 bg-black/30 backdrop-blur-md rounded-2xl border border-white/15 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMode('url')}
              className={`flex-1 py-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                mode === 'url' ? 'bg-gradient-to-r from-emerald-500/90 to-teal-500/90 text-white shadow-md border border-white/25' : 'text-slate-300/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>
                {language === 'mg'
                  ? 'Rohy Pejy Web'
                  : language === 'fr'
                  ? 'Lien Web'
                  : 'Web Link'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMode('vcard')}
              className={`flex-1 py-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                mode === 'vcard' ? 'bg-gradient-to-r from-emerald-500/90 to-teal-500/90 text-white shadow-md border border-white/25' : 'text-slate-300/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>
                {language === 'mg'
                  ? 'Karatra Nomerika (vCard)'
                  : language === 'fr'
                  ? 'Fiche Contact (vCard)'
                  : 'Digital Card (vCard)'}
              </span>
            </button>
          </div>

          {/* QR Display Container */}
          <div className="mt-4 p-5 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center border border-white/40" ref={qrRef}>
            <QRCodeSVG
              value={qrValue}
              size={200}
              level="H"
              includeMargin={false}
              fgColor="#0f172a"
              bgColor="#ffffff"
            />
          </div>

          <p className="text-xs text-slate-300/80 mt-3 leading-relaxed">
            {language === 'mg'
              ? 'Apetraho eo anoloan\'ny fakan-tsary (Camera finday) ity kaody ity mba hisokatra avy hatrany ny contact.'
              : language === 'fr'
              ? 'Scannez ce code QR avec l\'appareil photo de votre smartphone pour enregistrer la fiche de contact.'
              : 'Scan this QR code with your mobile camera to quickly save or access this contact profile.'}
          </p>

          {/* Actions: Download QR & Copy Link */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              id="download-qr-image-btn"
              type="button"
              onClick={handleDownloadQR}
              className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-white/15 transition-all cursor-pointer backdrop-blur-md active:scale-95"
            >
              <Download className="w-4 h-4 text-teal-300" />
              <span>
                {language === 'mg'
                  ? 'Haka Sary (PNG)'
                  : language === 'fr'
                  ? 'Télécharger (PNG)'
                  : 'Download (PNG)'}
              </span>
            </button>

            <button
              id="copy-qr-link-btn"
              type="button"
              onClick={handleCopyLink}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md border border-white/30 transition-all cursor-pointer backdrop-blur-md active:scale-95"
            >
              {isCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              <span>
                {isCopied
                  ? language === 'mg'
                    ? 'Voakopera!'
                    : language === 'fr'
                    ? 'Copié !'
                    : 'Copied!'
                  : language === 'mg'
                  ? 'Adikao Rohy'
                  : language === 'fr'
                  ? 'Copier le Lien'
                  : 'Copy Link'}
              </span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
