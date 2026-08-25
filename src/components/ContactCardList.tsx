import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PhoneCall,
  MessageSquare,
  Mail,
  Facebook,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Smartphone,
  Send,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { ContactInfo, Language } from '../types';
import { soundFX } from '../utils/audio';
import confetti from 'canvas-confetti';

interface Props {
  contact: ContactInfo;
  language: Language;
  onOpenQuickMessage: (defaultChannel: 'whatsapp' | 'email') => void;
}

export const ContactCardList: React.FC<Props> = ({ contact, language, onOpenQuickMessage }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleCopy = (text: string, key: string, label: string) => {
    soundFX.playTap();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(30);
    }
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setToastMessage(
      language === 'mg'
        ? `Voakopera: ${label}`
        : language === 'fr'
        ? `Copié dans le presse-papier : ${label}`
        : `Copied to clipboard: ${label}`
    );

    // Sparkle effect
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.8 },
      colors: ['#10b981', '#06b6d4', '#f59e0b', '#ffffff'],
    });

    setTimeout(() => {
      setCopiedKey(null);
      setToastMessage(null);
    }, 2500);
  };

  const contactItems = [
    {
      id: 'item-phone-call',
      key: 'phone-call',
      category: language === 'mg' ? 'Antso Mivantana' : language === 'fr' ? 'Appels Téléphoniques' : 'Phone Calls',
      title: language === 'mg' ? 'Laharana Finday' : language === 'fr' ? 'Numéro de Téléphone' : 'Phone Number',
      subtitle: contact.directPhone || contact.flotePhone,
      detail: language === 'mg' ? 'Laharana finday mivantana handraisana antso' : language === 'fr' ? 'Ligne téléphonique directe' : 'Direct phone line',
      icon: PhoneCall,
      accentColor: 'from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-400',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      badgeText: language === 'mg' ? 'Antso' : language === 'fr' ? 'Téléphone' : 'Direct Call',
      actionUrl: `tel:${contact.directPhoneRaw || contact.flotePhoneRaw}`,
      actionLabel: language === 'mg' ? 'Hiantso' : language === 'fr' ? 'Appeler' : 'Call',
      copyValue: contact.directPhone || contact.flotePhone,
      isPrimary: true,
    },
    {
      id: 'item-whatsapp',
      key: 'whatsapp',
      category: 'WhatsApp',
      title: language === 'mg' ? 'WhatsApp Mivantana' : language === 'fr' ? 'WhatsApp Direct' : 'WhatsApp Direct',
      subtitle: contact.whatsappPhone,
      detail: language === 'mg' ? 'Mandefasa hafatra mivantana amin\'ny WhatsApp' : language === 'fr' ? 'Discussion instantanée et messagerie directe' : 'Direct instant messaging',
      icon: MessageSquare,
      accentColor: 'from-emerald-500/20 to-green-500/10 border-emerald-500/40 text-emerald-400',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      badgeText: language === 'mg' ? 'Mavitrika' : language === 'fr' ? 'En Ligne' : 'Online',
      actionUrl: `https://wa.me/${contact.whatsappPhoneRaw}?text=${encodeURIComponent(
        language === 'mg'
          ? "Manao ahoana tompoko Raïssa Sabe (Sekreteran'ny MID), maniry hifandray aminao aho."
          : language === 'fr'
          ? "Bonjour Madame Raïssa Sabe (Secrétaire auprès du MID), je vous contacte au sujet d'un dossier administratif."
          : "Hello Mrs. Raïssa Sabe (Secretary at MID), I am contacting you regarding official matters."
      )}`,
      actionLabel: language === 'mg' ? 'Handefa Hafatra' : language === 'fr' ? 'Discuter' : 'Chat',
      copyValue: contact.whatsappPhone,
      customQuickAction: () => onOpenQuickMessage('whatsapp'),
      isPrimary: true,
    },
    {
      id: 'item-facebook',
      key: 'facebook',
      category: 'Facebook',
      title: language === 'mg' ? 'Kaonty Facebook' : language === 'fr' ? 'Profil Facebook' : 'Facebook Profile',
      subtitle: contact.facebookName,
      detail: language === 'mg' ? 'Tsidiho ny kaonty Facebook an\'i Raïssa Sabe' : language === 'fr' ? 'Profil Facebook officiel de Raïssa Sabe' : 'Official Facebook profile',
      icon: Facebook,
      accentColor: 'from-blue-600/20 to-indigo-600/10 border-blue-500/40 text-blue-400',
      badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      badgeText: language === 'mg' ? 'Facebook' : language === 'fr' ? 'Réseau' : 'Social',
      actionUrl: contact.facebookUrl,
      actionLabel: language === 'mg' ? 'Hijery' : language === 'fr' ? 'Consulter' : 'Visit',
      copyValue: contact.facebookName,
      isPrimary: false,
    },
    {
      id: 'item-email',
      key: 'email',
      category: 'Email',
      title: language === 'mg' ? 'Adiresy Mailaka' : language === 'fr' ? 'Courrier Électronique' : 'Email Address',
      subtitle: contact.email,
      detail: language === 'mg' ? 'Handefa taratasy na antontan-taratasy' : language === 'fr' ? 'Courriers administratifs et pièces jointes' : 'Official electronic correspondence and documents',
      icon: Mail,
      accentColor: 'from-rose-500/20 to-pink-500/10 border-rose-500/40 text-rose-400',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      badgeText: language === 'mg' ? 'Ofisialy' : language === 'fr' ? 'Officiel' : 'Official',
      actionUrl: `mailto:${contact.email}?subject=${encodeURIComponent(
        language === 'mg'
          ? "Fifandraisana - Minisiteran'ny Atitany sy ny Fitsinjaram-pahefana"
          : language === 'fr'
          ? 'Correspondance - Secrétariat MID'
          : 'Correspondence - Ministry Secretariat MID'
      )}`,
      actionLabel: language === 'mg' ? 'Handefa Mail' : language === 'fr' ? 'Écrire' : 'Send',
      copyValue: contact.email,
      customQuickAction: () => onOpenQuickMessage('email'),
      isPrimary: false,
    },
    {
      id: 'item-sms',
      key: 'sms',
      category: 'SMS',
      title: language === 'mg' ? 'Hafatra SMS' : language === 'fr' ? 'Message SMS' : 'SMS Text',
      subtitle: contact.directPhone || contact.flotePhone,
      detail: language === 'mg' ? 'Mandefasa hafatra fohy amin\'ny finday' : language === 'fr' ? 'Envoyer un texto ou SMS classique' : 'Send standard SMS text message',
      icon: Smartphone,
      accentColor: 'from-purple-500/20 to-indigo-500/10 border-purple-500/40 text-purple-400',
      badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      badgeText: 'SMS',
      actionUrl: `sms:+${contact.directPhoneRaw || contact.flotePhoneRaw}?body=${encodeURIComponent(
        language === 'mg'
          ? 'Manao ahoana tompoko Raïssa Sabe,'
          : language === 'fr'
          ? 'Bonjour Madame Raïssa Sabe,'
          : 'Hello Mrs. Raïssa Sabe,'
      )}`,
      actionLabel: 'SMS',
      copyValue: contact.directPhone || contact.flotePhone,
      isPrimary: false,
    },
    {
      id: 'item-location',
      key: 'location',
      category: language === 'mg' ? 'Toerana / Birao' : language === 'fr' ? 'Localisation du Siège' : 'Office Location',
      title: language === 'mg' ? 'Biraon\'ny Minisitera' : language === 'fr' ? 'Siège du Ministère' : 'Ministry Headquarters',
      subtitle: language === 'mg' ? 'Anosy, Antananarivo, Madagasikara' : 'Anosy, Antananarivo, Madagascar',
      detail: language === 'mg' ? contact.ministryMg : language === 'fr' ? contact.ministryFr : contact.ministryEn,
      icon: Building,
      accentColor: 'from-teal-500/20 to-emerald-500/10 border-teal-500/40 text-teal-400',
      badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
      badgeText: 'Anosy 101',
      actionUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Ministère de l\'Intérieur et de la Décentralisation Anosy Antananarivo')}`,
      actionLabel: language === 'mg' ? 'Sarin-tany' : language === 'fr' ? 'Localiser' : 'Map',
      copyValue: contact.location,
      isPrimary: false,
    },
  ];

  return (
    <section id="contact-channels" className="space-y-3.5 w-full">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-emerald-400" />
          <span>
            {language === 'mg'
              ? 'Lalana Fifandraisana Mivantana'
              : language === 'fr'
              ? 'Canaux de Contact Direct'
              : 'Direct Contact Channels'}
          </span>
        </h2>
        <span className="text-xs text-slate-400">
          {language === 'mg'
            ? 'Tsindrio handefasana na hiantsoana'
            : language === 'fr'
            ? 'Cliquez pour agir'
            : 'Click to interact'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {contactItems.map((item) => {
          const Icon = item.icon;
          const isCopied = copiedKey === item.key;

          return (
            <motion.div
              key={item.key}
              id={item.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`relative overflow-hidden rounded-2xl p-4 bg-gradient-to-r ${item.accentColor} bg-white/[0.05] border border-white/15 hover:border-white/30 backdrop-blur-2xl shadow-xl shadow-black/20 transition-all duration-300 group`}
            >
              <div className="flex items-center justify-between gap-3">
                {/* Left side: Icon + Texts */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 group-hover:bg-white/15 transition-all duration-200">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="min-w-0 flex-1 text-left">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-white text-base truncate drop-shadow-xs">
                        {item.title}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border backdrop-blur-md ${item.badgeBg}`}>
                        {item.badgeText}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-slate-100 font-mono select-all truncate">
                      {item.subtitle}
                    </p>

                    <p className="text-xs text-slate-300/80 mt-0.5 truncate">
                      {item.detail}
                    </p>
                  </div>
                </div>

                {/* Right side: Action buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Copy Button */}
                  <button
                    id={`copy-${item.key}-btn`}
                    type="button"
                    onClick={() => handleCopy(item.copyValue, item.key, item.title)}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 hover:text-white backdrop-blur-md transition-all cursor-pointer shadow-sm active:scale-95"
                    title={language === 'mg' ? 'Adikao' : language === 'fr' ? 'Copier' : 'Copy'}
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4 text-emerald-300 animate-scale-in" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  {/* Primary Direct Link / Launch Button */}
                  <a
                    id={`action-${item.key}-link`}
                    href={item.actionUrl}
                    target={item.actionUrl.startsWith('http') ? '_blank' : undefined}
                    rel={item.actionUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer shadow-md backdrop-blur-md active:scale-95 ${
                      item.isPrimary
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-extrabold shadow-emerald-950/40 border border-white/30 hover:shadow-lg'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    }`}
                  >
                    <span>{item.actionLabel}</span>
                    {item.actionUrl.startsWith('http') ? (
                      <ExternalLink className="w-3.5 h-3.5" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                  </a>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-emerald-600/90 text-white text-sm font-bold shadow-2xl flex items-center gap-2 border border-white/30 backdrop-blur-xl"
          >
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
