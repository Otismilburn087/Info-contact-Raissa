export type Language = 'mg' | 'fr' | 'en';

export interface ContactInfo {
  fullName: string;
  shortName: string;
  officialTitleMg: string;
  officialTitleFr: string;
  officialTitleEn: string;
  roleMg?: string;
  roleFr?: string;
  roleEn?: string;
  ministryMg: string;
  ministryFr: string;
  ministryEn: string;
  location: string;
  directPhone: string;
  directPhoneRaw: string;
  flotePhone: string;
  flotePhoneRaw: string;
  whatsappPhone: string;
  whatsappPhoneRaw: string;
  email: string;
  facebookName: string;
  facebookUrl: string;
  officeHours?: string;
  bioMg?: string;
  bioFr?: string;
  bioEn?: string;
}

export interface QuickMessageTemplate {
  id: string;
  category: string;
  titleMg: string;
  titleFr: string;
  titleEn: string;
  bodyMg: string;
  bodyFr: string;
  bodyEn: string;
}
