/**
 * Script to generate PDF CVs from YAML data
 * Usage: npm run pdf:es | npm run pdf:en | npm run pdf:all
 */

import { renderToFile } from '@react-pdf/renderer';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import React from 'react';

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import types
interface LocalizedString {
  es: string;
  en: string;
}

interface ResumeData {
  meta: { version: string; lastUpdated: string };
  personal: {
    name: string;
    photo: string;
    email: string;
    phone: string;
    location: { city: string; state: string; country: string };
    links: Record<string, string>;
  };
  title: LocalizedString;
  summary: { short: LocalizedString; full: LocalizedString };
  experience: Array<{
    company: string;
    location: string;
    title: LocalizedString;
    startDate: string;
    endDate: string | null;
    highlights: { es: string[]; en: string[] };
    description: LocalizedString;
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
    description: LocalizedString;
    certificate: string | null;
    showInPdf?: boolean;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    certificate: string;
    description?: LocalizedString;
    showInPdf?: boolean;
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
      items: string[];
    }>;
  };
  volunteer: Array<{
    organization: string;
    fullName: string;
    role: LocalizedString;
    startDate: string;
    endDate: string;
    description: LocalizedString;
    showInPdf?: boolean;
  }>;
  references: Array<{
    name: string;
    relationship: LocalizedString;
    email: string;
    showInPdf?: boolean;
  }>;
}

type Language = 'es' | 'en';

// Helper function
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

// We need to import the PDF renderer components directly
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from '@react-pdf/renderer';

// ATS-friendly styles
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
});

// PDF Document Component
function createPdfDocument(data: ResumeData, lang: Language) {
  const { personal, title, summary, experience, education, skills, languages, certifications } = data;

  const pdfExperience = experience.filter(e => e.showInPdf !== false);
  const pdfEducation = education.filter(e => e.showInPdf !== false);
  const pdfCertifications = certifications.filter(c => c.showInPdf !== false);

  const labels = {
    summary: lang === 'es' ? 'Resumen Profesional' : 'Professional Summary',
    experience: lang === 'es' ? 'Experiencia Profesional' : 'Professional Experience',
    education: lang === 'es' ? 'Educación' : 'Education',
    skills: lang === 'es' ? 'Habilidades Técnicas' : 'Technical Skills',
    languages: lang === 'es' ? 'Idiomas' : 'Languages',
    certifications: lang === 'es' ? 'Certificaciones' : 'Certifications',
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
        React.createElement(Text, { style: styles.title }, t(title, lang)),
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
      // Summary
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, labels.summary),
        React.createElement(Text, { style: styles.summary }, t(summary.short, lang))
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
                React.createElement(Text, { style: styles.itemTitle }, t(job.title, lang)),
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
              ...job.highlights[lang].map((highlight, i) =>
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
      // Two columns: Skills and Languages
      React.createElement(
        View,
        { style: styles.twoColumn },
        // Skills column
        React.createElement(
          View,
          { style: [styles.section, styles.column] },
          React.createElement(Text, { style: styles.sectionTitle }, labels.skills),
          ...skills.categories.slice(0, 4).map((category, index) =>
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
            ...pdfCertifications.slice(0, 3).map((cert, index) =>
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

async function generatePdf(lang: Language) {
  const projectRoot = path.resolve(__dirname, '..');
  
  // Read YAML data
  const yamlPath = path.join(projectRoot, 'src', 'data', 'resume.yaml');
  const yamlContent = fs.readFileSync(yamlPath, 'utf-8');
  const data = yaml.load(yamlContent) as ResumeData;

  // Create output directory
  const outputDir = path.join(projectRoot, 'public', 'cv');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate PDF
  const outputPath = path.join(outputDir, `CV_Daniel_Carvajal_${lang.toUpperCase()}.pdf`);
  
  console.log(`Generating ${lang.toUpperCase()} PDF...`);
  
  const document = createPdfDocument(data, lang);
  await renderToFile(document, outputPath);
  
  console.log(`✓ Generated: ${outputPath}`);
}

async function main() {
  const args = process.argv.slice(2);
  const lang = args[0] || 'all';

  try {
    if (lang === 'all') {
      await generatePdf('es');
      await generatePdf('en');
    } else if (lang === 'es' || lang === 'en') {
      await generatePdf(lang);
    } else {
      console.error('Invalid language. Use: es, en, or all');
      process.exit(1);
    }
    
    console.log('\n✅ PDF generation complete!');
  } catch (error) {
    console.error('Error generating PDF:', error);
    process.exit(1);
  }
}

main();

