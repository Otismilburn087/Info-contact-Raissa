import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, MessageSquare, Mail, Smartphone, FileText } from 'lucide-react';
import { ContactInfo, Language } from '../types';
import { messageTemplates } from '../data/contactData';
import { soundFX } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  contact: ContactInfo;
  language: Language;
  defaultChannel?: 'whatsapp' | 'email';
}

export const QuickMessageModal: React.FC<Props> = ({
  isOpen,
  onClose,
  contact,
  language,
  defaultChannel = 'whatsapp',
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('rdv');
  const [channel, setChannel] = useState<'whatsapp' | 'email' | 'sms'>(defaultChannel);
  const [senderName, setSenderName] = useState('');
  const [senderAffiliation, setSenderAffiliation] = useState('');
  const [customMessage, setCustomMessage] = useState('');

  if (!isOpen) return null;

  const currentTemplate = messageTemplates.find((t) => t.id === selectedTemplateId) || messageTemplates[0];

  const getTemplateText = () => {
    if (language === 'mg') return currentTemplate.bodyMg;
    if (language === 'fr') return currentTemplate.bodyFr;
    return currentTemplate.bodyEn;
  };

  const getSenderFallback = () => {
    if (language === 'mg') return '(Mpampita hafatra)';
    if (language === 'fr') return '(Expéditeur)';
    return '(Sender)';
  };

  const fullMessage = `${customMessage.trim() || getTemplateText()}

— ${senderName ? senderName : getSenderFallback()}${
    senderAffiliation ? ` (${senderAffiliation})` : ''
  }`;

  const handleSend = () => {
    soundFX.playSuccess();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(40);
    }

    if (channel === 'whatsapp') {
      const url = `https://wa.me/${contact.whatsappPhoneRaw}?text=${encodeURIComponent(fullMessage)}`;
      window.open(url, '_blank');
    } else if (channel === 'email') {
      const subject =
        language === 'mg'
          ? `Hafatra avy amin'i ${senderName || 'Mpandefa'} - Minisiteran'ny Atitany`
          : language === 'fr'
          ? `Message de ${senderName || 'Contact'} - Secrétariat MID`
          : `Message from ${senderName || 'Contact'} - Ministry Secretariat`;
      const url = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(fullMessage)}`;
      window.location.href = url;
    } else {
      const url = `sms:+${contact.directPhoneRaw || contact.flotePhoneRaw}?body=${encodeURIComponent(fullMessage)}`;
      window.location.href = url;
    }
    onClose();
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
          className="relative max-w-lg w-full bg-slate-900/85 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/20 shadow-[0_16px_48px_0_rgba(0,0,0,0.6)] p-5 sm:p-6 my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/15">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-400/30 backdrop-blur-md">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base sm:text-lg">
                  {language === 'mg'
                    ? 'Mandefa Hafatra ho an\'i Raïssa'
                    : language === 'fr'
                    ? 'Envoyer un Message à Raïssa'
                    : 'Send Message to Raïssa'}
                </h3>
                <p className="text-xs text-slate-300/80">
                  {contact.fullName} — {language === 'mg' ? contact.roleMg : language === 'fr' ? contact.roleFr : contact.roleEn}
                </p>
              </div>
            </div>
            <button
              id="close-msg-modal-btn"
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 transition-colors border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="mt-4 space-y-4">
            {/* Channel Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                {language === 'mg'
                  ? 'Lalana handefasana azy'
                  : language === 'fr'
                  ? 'Canal d\'envoi'
                  : 'Delivery channel'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setChannel('whatsapp')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all backdrop-blur-md ${
                    channel === 'whatsapp'
                      ? 'bg-emerald-500/30 border-emerald-400/60 text-emerald-200 shadow-md'
                      : 'bg-white/[0.05] border-white/10 text-slate-300/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChannel('email')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all backdrop-blur-md ${
                    channel === 'email'
                      ? 'bg-rose-500/30 border-rose-400/60 text-rose-200 shadow-md'
                      : 'bg-white/[0.05] border-white/10 text-slate-300/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChannel('sms')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all backdrop-blur-md ${
                    channel === 'sms'
                      ? 'bg-purple-500/30 border-purple-400/60 text-purple-200 shadow-md'
                      : 'bg-white/[0.05] border-white/10 text-slate-300/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>SMS</span>
                </button>
              </div>
            </div>

            {/* Template Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                {language === 'mg'
                  ? 'Modely hafatra vonona'
                  : language === 'fr'
                  ? 'Modèles de message'
                  : 'Message templates'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {messageTemplates.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => {
                      setSelectedTemplateId(tpl.id);
                      setCustomMessage(
                        language === 'mg' ? tpl.bodyMg : language === 'fr' ? tpl.bodyFr : tpl.bodyEn
                      );
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all backdrop-blur-md ${
                      selectedTemplateId === tpl.id
                        ? 'bg-teal-500/25 border-teal-400/70 text-teal-200 shadow-md'
                        : 'bg-white/[0.04] border-white/10 text-slate-300/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold mb-0.5">
                      <FileText className="w-3 h-3 text-teal-300 shrink-0" />
                      <span className="truncate">
                        {language === 'mg' ? tpl.titleMg : language === 'fr' ? tpl.titleFr : tpl.titleEn}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sender details inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300/80 mb-1">
                  {language === 'mg'
                    ? 'Anaranao'
                    : language === 'fr'
                    ? 'Votre Nom'
                    : 'Your Name'}
                </label>
                <input
                  type="text"
                  placeholder={
                    language === 'mg'
                      ? 'Ohatra: Rakoto Jean'
                      : language === 'fr'
                      ? 'Ex: Jean Dupont'
                      : 'Ex: John Doe'
                  }
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 backdrop-blur-md border border-white/15 text-slate-100 text-sm focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30 placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300/80 mb-1">
                  {language === 'mg'
                    ? 'Orinasa / Sampan-draharaha'
                    : language === 'fr'
                    ? 'Structure / Organisation'
                    : 'Organization / Department'}
                </label>
                <input
                  type="text"
                  placeholder={
                    language === 'mg'
                      ? 'Ohatra: Kaominina, Orinasa...'
                      : language === 'fr'
                      ? 'Ex: Commune, Société...'
                      : 'Ex: Municipality, Enterprise...'
                  }
                  value={senderAffiliation}
                  onChange={(e) => setSenderAffiliation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 backdrop-blur-md border border-white/15 text-slate-100 text-sm focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30 placeholder-slate-500"
                />
              </div>
            </div>

            {/* Editable message body */}
            <div>
              <label className="block text-xs font-medium text-slate-300/80 mb-1">
                {language === 'mg'
                  ? 'Vontoatin\'ny hafatra'
                  : language === 'fr'
                  ? 'Contenu du message'
                  : 'Message content'}
              </label>
              <textarea
                rows={4}
                value={customMessage || getTemplateText()}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-black/30 backdrop-blur-md border border-white/15 text-slate-100 text-sm focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30 resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Action footer */}
          <div className="mt-5 pt-4 border-t border-white/15 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300/80 hover:text-white transition-colors"
            >
              {language === 'mg'
                ? 'Aoka ihany'
                : language === 'fr'
                ? 'Annuler'
                : 'Cancel'}
            </button>

            <button
              id="send-quick-msg-submit-btn"
              type="button"
              onClick={handleSend}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-950/40 border border-white/30 cursor-pointer active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>
                {language === 'mg'
                  ? `Handefa amin'ny ${channel.toUpperCase()}`
                  : language === 'fr'
                  ? `Envoyer via ${channel.toUpperCase()}`
                  : `Send via ${channel.toUpperCase()}`}
              </span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
