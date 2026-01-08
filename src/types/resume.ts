// =============================================================================
// Types for Resume Data
// =============================================================================

export type Language = 'es' | 'en';
export type Profile = 'hybrid' | 'de' | 'ds';

export interface LocalizedString {
  es: string;
  en: string;
}

// Estructura para datos que varían por perfil
export interface ProfiledLocalizedString {
  hybrid: LocalizedString;
  de: LocalizedString;
  ds: LocalizedString;
}

export interface ProfiledHighlights {
  hybrid: { es: string[]; en: string[] };
  de: { es: string[]; en: string[] };
  ds: { es: string[]; en: string[] };
}

export interface Meta {
  version: string;
  lastUpdated: string;
  profiles?: Profile[];
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

// Summary with short (per profile) and full (shared)
export interface SummaryRaw {
  short: ProfiledLocalizedString;
  full: LocalizedString;
}

// Experience con perfiles
export interface Experience {
  company: string;
  location: string;
  title: ProfiledLocalizedString;
  startDate: string;
  endDate: string | null;
  highlights: ProfiledHighlights;
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
  certificate: string | null;
  showInPdf?: boolean;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  certificate: string | null;
  description?: LocalizedString;
  category?: string;
  profiles?: Profile[];
  showInPdf?: boolean;
  isCertification?: boolean; // true = certificación real, false/undefined = curso
}

export interface LanguageSkill {
  name: LocalizedString;
  level: LocalizedString;
  certificate?: string | null;
  score?: string;
}

export interface SkillCategory {
  name: LocalizedString;
  items: string[];
  priority?: number;
  profiles?: Profile[];
  showInPdf?: boolean;
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

export interface Publication {
  title: string;
  journal: string;
  year: number;
  doi: string;
  description: LocalizedString;
  profiles?: Profile[];
}

// Titles data from titles.json
export interface TitlesData {
  titles: ProfiledLocalizedString;
  descriptions: {
    hybrid: string;
    de: string;
    ds: string;
  };
}

// Raw data as it comes from YAML (title and short summary are now in titles.json)
export interface ResumeDataRaw {
  meta: Meta;
  personal: Personal;
  summary: SummaryRaw;
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  languages: LanguageSkill[];
  skills: Skills;
  publications: Publication[];
  volunteer: Volunteer[];
  references: Reference[];
}

// Normalized data for components (using a specific profile)
export interface ResumeData {
  meta: Meta;
  personal: Personal;
  title: LocalizedString;
  summary: {
    short: LocalizedString;
    full: LocalizedString;
  };
  experience: NormalizedExperience[];
  education: Education[];
  certifications: Certification[];
  languages: LanguageSkill[];
  skills: Skills;
  publications: Publication[];
  volunteer: Volunteer[];
  references: Reference[];
}

export interface NormalizedExperience {
  company: string;
  location: string;
  title: LocalizedString;
  startDate: string;
  endDate: string | null;
  highlights: { es: string[]; en: string[] };
  keywords: string[];
  showInPdf?: boolean;
}

// =============================================================================
// Helper function to normalize data for a specific profile
// =============================================================================
export function normalizeResumeData(
  raw: ResumeDataRaw, 
  titles: TitlesData, 
  profile: Profile = 'hybrid'
): ResumeData {
  return {
    meta: raw.meta,
    personal: raw.personal,
    title: titles.titles[profile],
    summary: {
      // Short summary comes from resume.yaml (per profile)
      short: raw.summary.short[profile],
      // Full summary comes from resume.yaml (same for all profiles)
      full: raw.summary.full,
    },
    experience: raw.experience.map((exp) => ({
      company: exp.company,
      location: exp.location,
      title: exp.title[profile],
      startDate: exp.startDate,
      endDate: exp.endDate,
      highlights: exp.highlights[profile],
      keywords: exp.keywords,
      showInPdf: exp.showInPdf,
    })),
    education: raw.education,
    certifications: raw.certifications.filter(
      (cert) => !cert.profiles || cert.profiles.includes(profile)
    ),
    languages: raw.languages,
    skills: {
      categories: raw.skills.categories.filter(
        (cat) => !cat.profiles || cat.profiles.includes(profile)
      ),
    },
    publications: raw.publications.filter(
      (pub) => !pub.profiles || pub.profiles.includes(profile)
    ),
    volunteer: raw.volunteer,
    references: raw.references,
  };
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
  publications: LocalizedString;
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
  courses: LocalizedString;
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

export interface PublicationsLabels {
  title: LocalizedString;
  viewPaper: LocalizedString;
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
  publications: PublicationsLabels;
  volunteer: VolunteerLabels;
  references: ReferencesLabels;
  footer: FooterLabels;
  pdf: PdfLabels;
  languageSelector: LanguageSelectorLabels;
}
