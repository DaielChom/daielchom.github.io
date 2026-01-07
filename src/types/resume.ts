// =============================================================================
// Types for Resume Data
// =============================================================================

export type Language = 'es' | 'en';

export interface LocalizedString {
  es: string;
  en: string;
}

export interface Meta {
  version: string;
  lastUpdated: string;
}

export interface PersonalLinks {
  website?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  telegram?: string;
  instagram?: string;
  deviantart?: string;
}

export interface PersonalLocation {
  city: string;
  state: string;
  country: string;
}

export interface Personal {
  name: string;
  photo: string;
  email: string;
  phone: string;
  location: PersonalLocation;
  links: PersonalLinks;
}

export interface Summary {
  short: LocalizedString;
  full: LocalizedString;
}

export interface Experience {
  company: string;
  location: string;
  title: LocalizedString;
  startDate: string;
  endDate: string | null;
  highlights: {
    es: string[];
    en: string[];
  };
  description: LocalizedString;
  keywords: string[];
  showInPdf?: boolean;
}

export interface Education {
  institution: string;
  location: string;
  degree: LocalizedString;
  field: LocalizedString;
  startDate: string;
  endDate: string | null;
  highlights?: {
    es: string[];
    en: string[];
  };
  description: LocalizedString;
  certificate: string | null;
  showInPdf?: boolean;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  certificate: string;
  description?: LocalizedString;
  showInPdf?: boolean;
}

export interface LanguageSkill {
  name: LocalizedString;
  level: LocalizedString;
  certificate?: string;
  score?: string;
}

export interface SkillCategory {
  name: LocalizedString;
  items: string[];
}

export interface Skills {
  categories: SkillCategory[];
}

export interface Volunteer {
  organization: string;
  fullName: string;
  role: LocalizedString;
  startDate: string;
  endDate: string;
  description: LocalizedString;
  showInPdf?: boolean;
}

export interface Reference {
  name: string;
  relationship: LocalizedString;
  email: string;
  showInPdf?: boolean;
}

export interface ResumeData {
  meta: Meta;
  personal: Personal;
  title: LocalizedString;
  summary: Summary;
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  languages: LanguageSkill[];
  skills: Skills;
  volunteer: Volunteer[];
  references: Reference[];
}

// =============================================================================
// Types for Labels
// =============================================================================

export interface NavigationLabels {
  home: LocalizedString;
  about: LocalizedString;
  experience: LocalizedString;
  education: LocalizedString;
  skills: LocalizedString;
  contact: LocalizedString;
}

export interface HeaderLabels {
  greeting: LocalizedString;
  basedIn: LocalizedString;
  downloadCv: LocalizedString;
  viewCv: LocalizedString;
}

export interface AboutLabels {
  title: LocalizedString;
  contactDetails: LocalizedString;
}

export interface ExperienceLabels {
  title: LocalizedString;
  present: LocalizedString;
}

export interface EducationLabels {
  title: LocalizedString;
  certifications: LocalizedString;
  viewCertificate: LocalizedString;
}

export interface SkillsLabels {
  title: LocalizedString;
}

export interface LanguagesLabels {
  title: LocalizedString;
}

export interface VolunteerLabels {
  title: LocalizedString;
}

export interface ReferencesLabels {
  title: LocalizedString;
  available: LocalizedString;
}

export interface FooterLabels {
  madeWith: LocalizedString;
  and: LocalizedString;
}

export interface PdfLabels {
  generatedOn: LocalizedString;
  page: LocalizedString;
  of: LocalizedString;
}

export interface LanguageSelectorLabels {
  es: string;
  en: string;
}

export interface Labels {
  navigation: NavigationLabels;
  header: HeaderLabels;
  about: AboutLabels;
  experience: ExperienceLabels;
  education: EducationLabels;
  skills: SkillsLabels;
  languages: LanguagesLabels;
  volunteer: VolunteerLabels;
  references: ReferencesLabels;
  footer: FooterLabels;
  pdf: PdfLabels;
  languageSelector: LanguageSelectorLabels;
}


