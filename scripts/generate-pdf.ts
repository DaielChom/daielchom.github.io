/**
 * Script to generate PDF CVs from YAML data
 * Generates 8 versions: 4 profiles (ml, de, ds, edu) x 2 languages (es, en)
 * Usage: npm run pdf:all
 */

import { renderToFile } from '@react-pdf/renderer';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from '@react-pdf/renderer';

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =============================================================================
// Types
// =============================================================================

type Language = 'es' | 'en';
type Profile = 'ml' | 'de' | 'ds' | 'edu';

interface LocalizedString {
  es: string;
  en: string;
}

interface ProfiledLocalizedString {
  ml: LocalizedString;
  de: LocalizedString;
  ds: LocalizedString;
  edu?: LocalizedString;
}

interface ProfiledHighlights {
  ml: { es: string[]; en: string[] };
  de: { es: string[]; en: string[] };
  ds: { es: string[]; en: string[] };
  edu?: { es: string[]; en: string[] };
}

interface ResumeDataRaw {
  meta: { version: string; lastUpdated: string };
  personal: {
    name: string;
    photo: string;
    email: string;
    phone: string;
    location: { city: string; state: string; country: string };
    links: Record<string, string>;
  };
  summary: {
    short: ProfiledLocalizedString;
    full: LocalizedString;
  };
  experience: Array<{
    company: string;
    location: string;
    title: ProfiledLocalizedString;
    startDate: string;
    endDate: string | null;
    highlights: ProfiledHighlights;
    keywords: string[];
    showInPdf?: boolean;
  }>;
  education: Array<{
    institution: string;
    location: string;
    degree: LocalizedString;
    field: LocalizedString;
    startDate: string;
    endDate: string | null;
    highlights?: { es: string[]; en: string[] };
    certificate: string | null;
    showInPdf?: boolean;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    certificate: string | null;
    category?: string;
    profiles?: Profile[];
    showInPdf?: boolean;
    isCertification?: boolean;
  }>;
  languages: Array<{
    name: LocalizedString;
    level: LocalizedString;
    certificate?: string;
    score?: string;
  }>;
  skills: {
    categories: Array<{
      name: LocalizedString;
      category?: string;
      items: string[];
      priority?: number;
      profiles?: Profile[];
      showInPdf?: boolean;
    }>;
  };
  publications?: Array<{
    title: string;
    journal: string;
    year: number;
    doi: string;
    description: LocalizedString;
    profiles?: Profile[];
  }>;
}

interface TitlesData {
  titles: ProfiledLocalizedString & { edu: LocalizedString };
}

// =============================================================================
// Helper Functions
// =============================================================================

function t(obj: LocalizedString | undefined, lang: Language): string {
  if (!obj) return '';
  return obj[lang] || obj.es || '';
}

function formatDate(dateStr: string | null, lang: Language): string {
  if (!dateStr) {
    return lang === 'es' ? 'Presente' : 'Present';
  }
  if (dateStr.length === 4) return dateStr;
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short' };
  return date.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', options);
}

function summaryShortForProfile(
  short: ResumeDataRaw['summary']['short'],
  profile: Profile
): LocalizedString {
  if (profile === 'edu' && short.edu) return short.edu;
  if (profile === 'edu') return short.ml;
  return short[profile];
}

function jobHighlightsForProfile(
  highlights: ProfiledHighlights,
  profile: Profile,
  lang: Language
): string[] {
  if (profile === 'edu' && highlights.edu) return highlights.edu[lang];
  if (profile === 'edu') return highlights.ml[lang];
  return highlights[profile][lang];
}

// =============================================================================
// PDF Styles (ATS-friendly)
// =============================================================================

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 40,
    backgroundColor: '#FFFFFF',
    color: '#1a1a1a',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#0d9488',
    borderBottomStyle: 'solid',
    paddingBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: '#0d9488',
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: 9,
    color: '#475569',
  },
  contactItem: {
    marginRight: 10,
  },
  link: {
    color: '#0d9488',
    textDecoration: 'none',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    borderBottomStyle: 'solid',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summary: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#334155',
  },
  itemContainer: {
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  itemSubtitle: {
    fontSize: 10,
    color: '#0d9488',
  },
  itemDate: {
    fontSize: 9,
    color: '#64748b',
    textAlign: 'right',
  },
  itemLocation: {
    fontSize: 9,
    color: '#64748b',
    textAlign: 'right',
  },
  bulletList: {
    marginTop: 4,
    paddingLeft: 10,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bullet: {
    width: 10,
    fontSize: 9,
    color: '#0d9488',
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.4,
    color: '#334155',
  },
  skillCategory: {
    marginBottom: 6,
  },
  skillCategoryTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 2,
  },
  skillItem: {
    fontSize: 9,
    color: '#334155',
  },
  twoColumn: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    paddingRight: 10,
  },
  columnRight: {
    flex: 1,
    paddingLeft: 10,
  },
  languageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  languageName: {
    fontSize: 10,
    color: '#0f172a',
  },
  languageLevel: {
    fontSize: 9,
    color: '#64748b',
  },
  publicationItem: {
    marginBottom: 6,
  },
  publicationTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  publicationJournal: {
    fontSize: 9,
    color: '#64748b',
    fontStyle: 'italic',
  },
});

// =============================================================================
// PDF Document Component
// =============================================================================

function createPdfDocument(
  data: ResumeDataRaw,
  titles: TitlesData,
  profile: Profile,
  lang: Language
) {
  const { personal, summary, experience, education, skills, languages, certifications, publications } = data;

  // Get title for this profile
  const headerTitle = titles.titles[profile];

  // Filter data by profile and showInPdf
  const pdfExperience = experience.filter(e => e.showInPdf !== false);
  const pdfEducation = education.filter(e => e.showInPdf !== false);
  
  // Filter certifications: must be real certifications (isCertification: true) and match profile
  const pdfCertifications = certifications.filter(c => 
    c.isCertification === true && 
    c.showInPdf !== false &&
    (!c.profiles || c.profiles.includes(profile))
  );

  // Filter skills by profile and showInPdf
  const pdfSkills = skills.categories
    .filter(cat => 
      cat.showInPdf !== false &&
      (!cat.profiles || cat.profiles.includes(profile))
    )
    .sort((a, b) => (a.priority || 99) - (b.priority || 99));

  // Filter publications by profile
  const pdfPublications = (publications || []).filter(pub =>
    !pub.profiles || pub.profiles.includes(profile)
  );

  const labels = {
    summary: lang === 'es' ? 'Resumen Profesional' : 'Professional Summary',
    experience: lang === 'es' ? 'Experiencia Profesional' : 'Professional Experience',
    education: lang === 'es' ? 'Educación' : 'Education',
    skills: lang === 'es' ? 'Habilidades Técnicas' : 'Technical Skills',
    languages: lang === 'es' ? 'Idiomas' : 'Languages',
    certifications: lang === 'es' ? 'Certificaciones' : 'Certifications',
    publications: lang === 'es' ? 'Publicaciones' : 'Publications',
  };

  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: 'A4', style: styles.page },
      // Header
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(Text, { style: styles.name }, personal.name),
        React.createElement(Text, { style: styles.title }, t(headerTitle, lang)),
        React.createElement(
          View,
          { style: styles.contactRow },
          React.createElement(Text, { style: styles.contactItem }, personal.email),
          React.createElement(Text, { style: styles.contactItem }, ' | '),
          React.createElement(Text, { style: styles.contactItem }, personal.phone),
          React.createElement(Text, { style: styles.contactItem }, ' | '),
          React.createElement(Text, { style: styles.contactItem }, `${personal.location.city}, ${personal.location.country}`),
          personal.links.linkedin && React.createElement(Text, { style: styles.contactItem }, ' | '),
          personal.links.linkedin && React.createElement(
            Link,
            { src: personal.links.linkedin, style: styles.link },
            'LinkedIn'
          ),
          personal.links.github && React.createElement(Text, { style: styles.contactItem }, ' | '),
          personal.links.github && React.createElement(
            Link,
            { src: personal.links.github, style: styles.link },
            'GitHub'
          )
        )
      ),
      // Summary (short version for this profile)
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, labels.summary),
        React.createElement(
          Text,
          { style: styles.summary },
          t(summaryShortForProfile(summary.short, profile), lang)
        )
      ),
      // Experience
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, labels.experience),
        ...pdfExperience.map((job, index) =>
          React.createElement(
            View,
            { key: index, style: styles.itemContainer },
            React.createElement(
              View,
              { style: styles.itemHeader },
              React.createElement(
                View,
                null,
                React.createElement(
                  Text,
                  { style: styles.itemTitle },
                  t(
                    profile === 'edu' && job.title.edu
                      ? job.title.edu
                      : profile === 'edu'
                        ? job.title.ml
                        : job.title[profile],
                    lang
                  )
                ),
                React.createElement(Text, { style: styles.itemSubtitle }, job.company)
              ),
              React.createElement(
                View,
                null,
                React.createElement(
                  Text,
                  { style: styles.itemDate },
                  `${formatDate(job.startDate, lang)} - ${formatDate(job.endDate, lang)}`
                ),
                React.createElement(Text, { style: styles.itemLocation }, job.location)
              )
            ),
            React.createElement(
              View,
              { style: styles.bulletList },
              ...jobHighlightsForProfile(job.highlights, profile, lang).map((highlight, i) =>
                React.createElement(
                  View,
                  { key: i, style: styles.bulletItem },
                  React.createElement(Text, { style: styles.bullet }, '•'),
                  React.createElement(Text, { style: styles.bulletText }, highlight)
                )
              )
            )
          )
        )
      ),
      // Education
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, labels.education),
        ...pdfEducation.map((edu, index) =>
          React.createElement(
            View,
            { key: index, style: styles.itemContainer },
            React.createElement(
              View,
              { style: styles.itemHeader },
              React.createElement(
                View,
                null,
                React.createElement(Text, { style: styles.itemTitle }, t(edu.degree, lang)),
                React.createElement(Text, { style: styles.itemSubtitle }, edu.institution)
              ),
              React.createElement(
                View,
                null,
                React.createElement(
                  Text,
                  { style: styles.itemDate },
                  `${formatDate(edu.startDate, lang)} - ${formatDate(edu.endDate, lang)}`
                ),
                React.createElement(Text, { style: styles.itemLocation }, edu.location)
              )
            ),
            edu.highlights && edu.highlights[lang] && React.createElement(
              View,
              { style: styles.bulletList },
              ...edu.highlights[lang].map((highlight, i) =>
                React.createElement(
                  View,
                  { key: i, style: styles.bulletItem },
                  React.createElement(Text, { style: styles.bullet }, '•'),
                  React.createElement(Text, { style: styles.bulletText }, highlight)
                )
              )
            )
          )
        )
      ),
      // Publications (if any for this profile)
      pdfPublications.length > 0 && React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, labels.publications),
        ...pdfPublications.map((pub, index) =>
          React.createElement(
            View,
            { key: index, style: styles.publicationItem },
            React.createElement(Text, { style: styles.publicationTitle }, pub.title),
            React.createElement(Text, { style: styles.publicationJournal }, `${pub.journal}, ${pub.year}`)
          )
        )
      ),
      // Two columns: Skills and Languages/Certifications
      React.createElement(
        View,
        { style: styles.twoColumn },
        // Skills column
        React.createElement(
          View,
          { style: [styles.section, styles.column] },
          React.createElement(Text, { style: styles.sectionTitle }, labels.skills),
          ...pdfSkills.slice(0, 5).map((category, index) =>
            React.createElement(
              View,
              { key: index, style: styles.skillCategory },
              React.createElement(Text, { style: styles.skillCategoryTitle }, `${t(category.name, lang)}:`),
              React.createElement(Text, { style: styles.skillItem }, category.items.join(', '))
            )
          )
        ),
        // Languages and certifications column
        React.createElement(
          View,
          { style: [styles.section, styles.columnRight] },
          React.createElement(Text, { style: styles.sectionTitle }, labels.languages),
          ...languages.map((language, index) =>
            React.createElement(
              View,
              { key: index, style: styles.languageRow },
              React.createElement(Text, { style: styles.languageName }, t(language.name, lang)),
              React.createElement(
                Text,
                { style: styles.languageLevel },
                `${t(language.level, lang)}${language.score ? ` (${language.score})` : ''}`
              )
            )
          ),
          pdfCertifications.length > 0 && React.createElement(
            View,
            { style: { marginTop: 10 } },
            React.createElement(Text, { style: styles.sectionTitle }, labels.certifications),
            ...pdfCertifications.slice(0, 4).map((cert, index) =>
              React.createElement(
                View,
                { key: index, style: { marginBottom: 3 } },
                React.createElement(Text, { style: styles.skillCategoryTitle }, cert.name),
                React.createElement(Text, { style: styles.skillItem }, `${cert.issuer} • ${formatDate(cert.date, lang)}`)
              )
            )
          )
        )
      )
    )
  );
}

// =============================================================================
// PDF Generation
// =============================================================================

async function generatePdf(
  data: ResumeDataRaw,
  titles: TitlesData,
  profile: Profile,
  lang: Language,
  outputDir: string
) {
  const profileNames: Record<Profile, string> = {
    ml: 'MLEngineer',
    de: 'DataEngineer',
    ds: 'DataScientist',
    edu: 'TechnicalInstructor',
  };

  const outputPath = path.join(
    outputDir,
    `CV_Daniel_Carvajal_${profileNames[profile]}_${lang.toUpperCase()}.pdf`
  );

  console.log(`  Generating ${profileNames[profile]} (${lang.toUpperCase()})...`);

  const document = createPdfDocument(data, titles, profile, lang);
  await renderToFile(document, outputPath);

  console.log(`  ✓ ${outputPath}`);
}

async function main() {
  const projectRoot = path.resolve(__dirname, '..');

  // Read YAML data
  const yamlPath = path.join(projectRoot, 'public', 'data', 'resume.yaml');
  const yamlContent = fs.readFileSync(yamlPath, 'utf-8');
  const data = yaml.load(yamlContent) as ResumeDataRaw;

  // Read titles.json
  const titlesPath = path.join(projectRoot, 'public', 'data', 'titles.json');
  const titlesContent = fs.readFileSync(titlesPath, 'utf-8');
  const titles = JSON.parse(titlesContent) as TitlesData;

  // Create output directory
  const outputDir = path.join(projectRoot, 'public', 'cv');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('\n📄 Generating PDF CVs...\n');

  const profiles: Profile[] = ['ml', 'de', 'ds', 'edu'];
  const languages: Language[] = ['es', 'en'];

  try {
    for (const profile of profiles) {
      for (const lang of languages) {
        await generatePdf(data, titles, profile, lang, outputDir);
      }
    }

    console.log('\n✅ All 8 PDFs generated successfully!\n');
    console.log('Files created:');
    const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.pdf'));
    files.forEach(f => console.log(`  - ${f}`));
  } catch (error) {
    console.error('\n❌ Error generating PDFs:', error);
    process.exit(1);
  }
}

main();
