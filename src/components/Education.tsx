import { GraduationCap, Award, ExternalLink, Calendar, MapPin } from 'lucide-react';
import type { ResumeData, Labels, Language, Education as EducationType, Certification } from '@/types/resume';

interface EducationProps {
  data: ResumeData;
  labels: Labels;
  lang: Language;
}

function t(obj: { es: string; en: string } | undefined, lang: Language): string {
  if (!obj) return '';
  return obj[lang];
}

function formatDate(dateStr: string | null, lang: Language): string {
  if (!dateStr) {
    return lang === 'es' ? 'Presente' : 'Present';
  }
  // Handle year-only format
  if (dateStr.length === 4) {
    return dateStr;
  }
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short' };
  return date.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', options);
}

function EducationCard({ item, lang, labels }: { item: EducationType; lang: Language; labels: Labels }) {
  return (
    <div className="glass-card group">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 text-primary-600 shrink-0">
          <GraduationCap className="w-6 h-6" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-surface-800 group-hover:text-primary-600 transition-colors">
            {t(item.degree, lang)}
          </h3>
          <p className="text-primary-600 font-medium mb-2">
            {item.institution}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-sm text-surface-500 mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(item.startDate, lang)} — {formatDate(item.endDate, lang)}
            </span>
            {item.location && (
              <>
                <span className="text-surface-400">•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {item.location}
                </span>
              </>
            )}
          </div>

          {/* Highlights */}
          {item.highlights && item.highlights[lang] && item.highlights[lang].length > 0 && (
            <ul className="space-y-1 mb-3">
              {item.highlights[lang].map((highlight, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-surface-600">
                  <span className="text-primary-500 mt-0.5">▹</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Certificate Link */}
          {item.certificate && (
            <a
              href={item.certificate}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              {t(labels.education.viewCertificate, lang)}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function CertificationCard({ item, lang, labels }: { item: Certification; lang: Language; labels: Labels }) {
  return (
    <div className="glass-card group p-4">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-accent-100 text-accent-600 shrink-0">
          <Award className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-surface-800 group-hover:text-primary-600 transition-colors text-sm">
            {item.name}
          </h4>
          <p className="text-surface-500 text-sm">{item.issuer}</p>
          <p className="text-surface-400 text-xs mt-1">{formatDate(item.date, lang)}</p>

          {item.certificate && (
            <a
              href={item.certificate}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 transition-colors mt-2"
            >
              <ExternalLink className="w-3 h-3" />
              {t(labels.education.viewCertificate, lang)}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function Education({ data, labels, lang }: EducationProps) {
  const { education, certifications } = data;
  
  // Filter certifications that should be shown
  const visibleCertifications = certifications.filter(c => c.showInPdf !== false);

  return (
    <section id="education" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-600 mb-4">
            <GraduationCap className="w-4 h-4" />
            <span className="text-sm font-medium">
              {t(labels.education.title, lang)}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold">
            <span className="gradient-text">{t(labels.education.title, lang)}</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Education */}
          <div>
            <h3 className="text-xl font-bold text-surface-800 mb-6 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary-500" />
              {t(labels.education.title, lang)}
            </h3>
            <div className="space-y-4">
              {education.map((item) => (
                <EducationCard
                  key={`${item.institution}-${item.startDate}`}
                  item={item}
                  lang={lang}
                  labels={labels}
                />
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="text-xl font-bold text-surface-800 mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-accent-500" />
              {t(labels.education.certifications, lang)}
            </h3>
            <div className="grid gap-3">
              {visibleCertifications.map((item) => (
                <CertificationCard
                  key={`${item.name}-${item.date}`}
                  item={item}
                  lang={lang}
                  labels={labels}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
