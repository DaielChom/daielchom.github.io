import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
  Font,
} from '@react-pdf/renderer';
import type { ResumeData, Language } from '@/types/resume';

// Register fonts for better typography
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica-Bold.ttf', fontWeight: 'bold' },
  ],
});

// ATS-friendly styles - simple, clean, no fancy formatting
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 40,
    backgroundColor: '#FFFFFF',
    color: '#1a1a1a',
  },
  // Header section
  header: {
    marginBottom: 20,
    borderBottom: '2 solid #0d9488',
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
    gap: 15,
    fontSize: 9,
    color: '#475569',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  link: {
    color: '#0d9488',
    textDecoration: 'none',
  },
  // Section styles
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
    paddingBottom: 3,
    borderBottom: '1 solid #e2e8f0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Summary
  summary: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#334155',
  },
  // Experience & Education items
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
  },
  itemLocation: {
    fontSize: 9,
    color: '#64748b',
  },
  // Bullet points
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
  // Skills
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillCategory: {
    marginBottom: 8,
  },
  skillCategoryTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 3,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillItem: {
    fontSize: 9,
    color: '#334155',
  },
  // Languages
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
  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#94a3b8',
  },
  // Two column layout for skills
  twoColumn: {
    flexDirection: 'row',
    gap: 20,
  },
  column: {
    flex: 1,
  },
});

// Helper to get localized string
function t(obj: { es: string; en: string } | undefined, lang: Language): string {
  if (!obj) return '';
  return obj[lang] || obj.es || '';
}

// Format date for PDF
function formatDate(dateStr: string | null, lang: Language): string {
  if (!dateStr) {
    return lang === 'es' ? 'Presente' : 'Present';
  }
  if (dateStr.length === 4) return dateStr;
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short' };
  return date.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', options);
}

interface PdfDocumentProps {
  data: ResumeData;
  lang: Language;
}

export function PdfDocument({ data, lang }: PdfDocumentProps) {
  const { personal, title, summary, experience, education, skills, languages, certifications } = data;

  // Filter items that should appear in PDF
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personal.name}</Text>
          <Text style={styles.title}>{t(title, lang)}</Text>
          
          <View style={styles.contactRow}>
            <Text>{personal.email}</Text>
            <Text>|</Text>
            <Text>{personal.phone}</Text>
            <Text>|</Text>
            <Text>{personal.location.city}, {personal.location.country}</Text>
            {personal.links.linkedin && (
              <>
                <Text>|</Text>
                <Link src={personal.links.linkedin} style={styles.link}>
                  LinkedIn
                </Link>
              </>
            )}
            {personal.links.github && (
              <>
                <Text>|</Text>
                <Link src={personal.links.github} style={styles.link}>
                  GitHub
                </Link>
              </>
            )}
          </View>
        </View>

        {/* Professional Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{labels.summary}</Text>
          <Text style={styles.summary}>{t(summary.short, lang)}</Text>
        </View>

        {/* Experience */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{labels.experience}</Text>
          {pdfExperience.map((job, index) => (
            <View key={index} style={styles.itemContainer}>
              <View style={styles.itemHeader}>
                <View>
                  <Text style={styles.itemTitle}>{t(job.title, lang)}</Text>
                  <Text style={styles.itemSubtitle}>{job.company}</Text>
                </View>
                <View>
                  <Text style={styles.itemDate}>
                    {formatDate(job.startDate, lang)} - {formatDate(job.endDate, lang)}
                  </Text>
                  <Text style={styles.itemLocation}>{job.location}</Text>
                </View>
              </View>
              
              <View style={styles.bulletList}>
                {job.highlights[lang].map((highlight, i) => (
                  <View key={i} style={styles.bulletItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{highlight}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Education */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{labels.education}</Text>
          {pdfEducation.map((edu, index) => (
            <View key={index} style={styles.itemContainer}>
              <View style={styles.itemHeader}>
                <View>
                  <Text style={styles.itemTitle}>{t(edu.degree, lang)}</Text>
                  <Text style={styles.itemSubtitle}>{edu.institution}</Text>
                </View>
                <View>
                  <Text style={styles.itemDate}>
                    {formatDate(edu.startDate, lang)} - {formatDate(edu.endDate, lang)}
                  </Text>
                  <Text style={styles.itemLocation}>{edu.location}</Text>
                </View>
              </View>
              {edu.highlights && edu.highlights[lang] && (
                <View style={styles.bulletList}>
                  {edu.highlights[lang].map((highlight, i) => (
                    <View key={i} style={styles.bulletItem}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.bulletText}>{highlight}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Two column section for Skills and Languages */}
        <View style={styles.twoColumn}>
          {/* Skills */}
          <View style={[styles.section, styles.column]}>
            <Text style={styles.sectionTitle}>{labels.skills}</Text>
            {skills.categories.slice(0, 4).map((category, index) => (
              <View key={index} style={styles.skillCategory}>
                <Text style={styles.skillCategoryTitle}>{t(category.name, lang)}:</Text>
                <Text style={styles.skillItem}>{category.items.join(', ')}</Text>
              </View>
            ))}
          </View>

          {/* Languages & Certifications */}
          <View style={[styles.section, styles.column]}>
            <Text style={styles.sectionTitle}>{labels.languages}</Text>
            {languages.map((language, index) => (
              <View key={index} style={styles.languageRow}>
                <Text style={styles.languageName}>{t(language.name, lang)}</Text>
                <Text style={styles.languageLevel}>
                  {t(language.level, lang)} {language.score ? `(${language.score})` : ''}
                </Text>
              </View>
            ))}

            {pdfCertifications.length > 0 && (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.sectionTitle}>{labels.certifications}</Text>
                {pdfCertifications.slice(0, 3).map((cert, index) => (
                  <View key={index} style={{ marginBottom: 3 }}>
                    <Text style={styles.skillCategoryTitle}>{cert.name}</Text>
                    <Text style={styles.skillItem}>{cert.issuer} • {formatDate(cert.date, lang)}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}

