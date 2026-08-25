import { ContactInfo, QuickMessageTemplate } from '../types';
import profilePhotoUrl from '../assets/images/raissa_portrait_original_1787667852794.jpg';

export const contactData: ContactInfo = {
  fullName: 'Raïssa Sabe',
  shortName: 'Raïssa',
  officialTitleMg: "Sekreteran'ny Minisitry ny Atitany sy ny Fitsinjaram-pahefana",
  officialTitleFr: "Secrétaire auprès du Ministère de l'Intérieur et de la Décentralisation",
  officialTitleEn: 'Secretary to the Ministry of the Interior and Decentralization',
  roleMg: "Sekretera MID",
  roleFr: "Secrétaire MID",
  roleEn: "Secretary MID",
  ministryMg: "Minisiteran'ny Atitany sy ny Fitsinjaram-pahefana (MID)",
  ministryFr: "Ministère de l'Intérieur et de la Décentralisation (MID)",
  ministryEn: 'Ministry of Interior and Decentralization (MID)',
  location: 'Anosy, Antananarivo 101, Madagasikara',
  directPhone: '+261 34 05 519 63',
  directPhoneRaw: '261340551963',
  flotePhone: '+261 34 05 519 63',
  flotePhoneRaw: '261340551963',
  whatsappPhone: '+261 32 72 30 715',
  whatsappPhoneRaw: '261327230715',
  email: 'raissasabe334@gmail.com',
  facebookName: 'Raïssa Sabe',
  facebookUrl: 'https://www.facebook.com/search/top?q=Ra%C3%AFssa%20Sabe',
  officeHours: '',
  bioMg: '',
  bioFr: '',
  bioEn: '',
};

export const messageTemplates: QuickMessageTemplate[] = [
  {
    id: 'rdv',
    category: 'Rendez-vous',
    titleMg: 'Fangatahana fotoana (Demande de RDV)',
    titleFr: 'Demande de rendez-vous officiel',
    titleEn: 'Official appointment request',
    bodyMg: "Manao ahoana tompoko Raïssa Sabe, mangataka fotoana fihaonana amin'ny birao aho momba ny raharaha...",
    bodyFr: "Bonjour Madame Raïssa Sabe, je souhaite solliciter un rendez-vous auprès de votre secrétariat concernant...",
    bodyEn: "Hello Ms. Raïssa Sabe, I would like to request an official appointment regarding...",
  },
  {
    id: 'info',
    category: 'Renseignement',
    titleMg: 'Fampahalalam-baovao ara-panjakana',
    titleFr: 'Renseignement administratif',
    titleEn: 'Administrative inquiry',
    bodyMg: "Manao ahoana tompoko Raïssa Sabe, manana fanontaniana momba ny antontan-taratasy sy dingana ara-panjakana aho...",
    bodyFr: "Bonjour Madame Raïssa Sabe, j'aurais besoin d'un renseignement administratif concernant les démarches de...",
    bodyEn: "Hello Ms. Raïssa Sabe, I need some administrative information regarding...",
  },
  {
    id: 'urgent',
    category: 'Urgent',
    titleMg: 'Hafatra maika sy manokana',
    titleFr: 'Message urgent',
    titleEn: 'Urgent message',
    bodyMg: "Manao ahoana tompoko Raïssa Sabe, manana hafatra maika mila valiny haingana aho tompoko...",
    bodyFr: "Bonjour Madame Raïssa Sabe, je vous transmets un message urgent qui nécessite une attention particulière...",
    bodyEn: "Hello Ms. Raïssa Sabe, I have an urgent matter requiring prompt attention...",
  },
];

// Helper to convert image URL to optimized Base64 JPEG for vCard embedding
async function getProfilePhotoBase64(): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          // Scale to 320x320 for optimal mobile contact photo size without bloating vCard
          const size = 320;
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, size, size);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            const base64Data = dataUrl.split(',')[1];
            resolve(base64Data || null);
          } else {
            resolve(null);
          }
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = profilePhotoUrl;
    } catch {
      resolve(null);
    }
  });
}

export function generateVCardString(contact: ContactInfo, photoBase64?: string | null): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${contact.fullName}`,
    `N:Sabe;Raïssa;;;`,
    `ORG:Ministère de l'Intérieur et de la Décentralisation (MID)`,
    `TITLE:${contact.officialTitleFr}`,
    `TEL;TYPE=CELL,VOICE,PREF:+261340551963`,
    `TEL;TYPE=CELL,WHATSAPP:+261327230715`,
    `EMAIL;TYPE=INTERNET,PREF:${contact.email}`,
    `URL;TYPE=FACEBOOK:${contact.facebookUrl}`,
    `ADR;TYPE=WORK:;;Anosy;Antananarivo;Analamanga;101;Madagascar`,
    `NOTE:Secrétaire auprès du Ministère de l'Intérieur et de la Décentralisation (Madagascar)`,
  ];

  if (photoBase64) {
    lines.push(`PHOTO;ENCODING=b;TYPE=JPEG:${photoBase64}`);
  }

  lines.push('END:VCARD');
  return lines.join('\r\n');
}

export async function downloadVCard(contact: ContactInfo) {
  const photoBase64 = await getProfilePhotoBase64();
  const vcard = generateVCardString(contact, photoBase64);
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${contact.fullName.replace(/\s+/g, '_')}_MID.vcf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
