import { useState } from 'react';
import { GraduationCap, Award, BookOpen, ExternalLink, Calendar, MapPin, ChevronDown } from 'lucide-react';
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
  if (dateStr.length === 4) {
    return dateStr;
  }
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short' };
  return date.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', options);
}

// Category labels for display (aligned with skills and certifications)
const categoryLabels: Record<string, { es: string; en: string }> = {
  'languages': { es: 'Lenguajes', en: 'Languages' },
  'ml': { es: 'Machine Learning & AI', en: 'Machine Learning & AI' },
  'databricks': { es: 'Databricks & Spark', en: 'Databricks & Spark' },
  'mlops': { es: 'MLOps & DataOps', en: 'MLOps & DataOps' },
  'data-engineering': { es: 'Data Engineering', en: 'Data Engineering' },
  'data-analysis': { es: 'Análisis de Datos', en: 'Data Analysis' },
  'cloud': { es: 'Cloud (AWS/GCP)', en: 'Cloud (AWS/GCP)' },
  'sql': { es: 'SQL & Bases de Datos', en: 'SQL & Databases' },
  'dev': { es: 'Desarrollo', en: 'Development' },
  'web': { es: 'Desarrollo Web', en: 'Web Development' },
  'integrations': { es: 'Integraciones', en: 'Integrations' },
  'softskills': { es: 'Habilidades Blandas', en: 'Soft Skills' },
  'bigdata': { es: 'Big Data', en: 'Big Data' },
  'english': { es: 'Inglés', en: 'English' },
  'networking': { es: 'Redes', en: 'Networking' },
};

function getYear(dateStr: string | null): string {
  if (!dateStr) return new Date().getFullYear().toString();
  return dateStr.split('-')[0];
}

function EducationTimeline({ items, lang, labels }: { items: EducationType[]; lang: Language; labels: Labels }) {
  return (
    <div className="relative flex gap-6 lg:gap-10">
      {/* Timeline Column - Only visible on lg screens */}
      <div className="hidden lg:flex flex-col items-center w-16 shrink-0 relative">
        {/* Timeline line */}
        <div className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-primary-400 via-primary-300 to-surface-200" />
        
        {/* Year dots */}
        {items.map((item, index) => {
          const year = getYear(item.endDate);
          
          return (
            <div
              key={`timeline-${item.institution}-${item.startDate}`}
              className="relative flex items-center justify-center"
              style={{
                marginTop: index === 0 ? '2rem' : 'auto',
                marginBottom: index === items.length - 1 ? '2rem' : 'auto',
                flex: 1,
              }}
            >
              {/* Dot */}
              <div className="relative z-10 w-4 h-4 rounded-full bg-white border-2 border-primary-400 shadow-md" />
              
              {/* Year label */}
              <div className="absolute right-full mr-3 whitespace-nowrap">
                <span className="text-sm font-medium text-surface-500">
                  {year}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cards Column */}
      <div className="flex-1 space-y-4">
        {items.map((item) => (
          <div key={`${item.institution}-${item.startDate}`} className="relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-8 left-0 w-6 lg:w-10 h-px bg-gradient-to-l from-surface-200 to-primary-300 -translate-x-full" />
            
            <div className="glass-card group">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 text-primary-600 shrink-0">
                  <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-surface-800 group-hover:text-primary-600 transition-colors">
                    {t(item.degree, lang)}
                  </h3>
                  <p className="text-primary-600 font-medium mb-2 text-sm sm:text-base">
                    {item.institution}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-surface-500 mb-3">
                    <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-surface-100">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="whitespace-nowrap">{formatDate(item.startDate, lang)} — {formatDate(item.endDate, lang)}</span>
                    </span>
                    {item.location && (
                      <span className="hidden sm:flex items-center gap-1 text-surface-500">
                        <MapPin className="w-4 h-4" />
                        {item.location}
                      </span>
                    )}
                  </div>

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
          </div>
        ))}
      </div>
    </div>
  );
}

// Category colors for badges (aligned with skills and certifications)
const categoryColors: Record<string, string> = {
  'languages': 'bg-violet-100 text-violet-700',
  'ml': 'bg-purple-100 text-purple-700',
  'databricks': 'bg-orange-100 text-orange-700',
  'mlops': 'bg-blue-100 text-blue-700',
  'data-engineering': 'bg-teal-100 text-teal-700',
  'data-analysis': 'bg-cyan-100 text-cyan-700',
  'cloud': 'bg-amber-100 text-amber-700',
  'sql': 'bg-green-100 text-green-700',
  'dev': 'bg-indigo-100 text-indigo-700',
  'web': 'bg-rose-100 text-rose-700',
  'integrations': 'bg-fuchsia-100 text-fuchsia-700',
  'softskills': 'bg-pink-100 text-pink-700',
  'bigdata': 'bg-red-100 text-red-700',
  'english': 'bg-sky-100 text-sky-700',
  'networking': 'bg-slate-100 text-slate-700',
};

function CertificationCard({ item, lang, labels }: { item: Certification; lang: Language; labels: Labels }) {
  const categoryLabel = categoryLabels[item.category || 'other'] || { es: item.category, en: item.category };
  const colorClass = categoryColors[item.category || 'other'] || 'bg-surface-100 text-surface-600';

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
          <div className="flex items-center gap-2 mt-1">
            <p className="text-surface-400 text-xs">{formatDate(item.date, lang)}</p>
            {item.category && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${colorClass}`}>
                {t(categoryLabel, lang)}
              </span>
            )}
          </div>

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

function CourseTimelineItem({ item, lang, labels }: { item: Certification; lang: Language; labels: Labels }) {
  const categoryLabel = categoryLabels[item.category || 'other'] || { es: item.category, en: item.category };
  const colorClass = categoryColors[item.category || 'other'] || 'bg-surface-100 text-surface-600';

  return (
    <div className="flex items-start gap-3 py-2 group">
      {/* Timeline dot */}
      <div className="mt-2 w-2 h-2 rounded-full bg-primary-400 shrink-0" />
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium text-surface-700 group-hover:text-primary-600 transition-colors">
              {item.name}
            </p>
            <p className="text-xs text-surface-500">{item.issuer}</p>
          </div>
          {item.certificate && (
            <a
              href={item.certificate}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded text-surface-400 hover:text-primary-600 transition-colors shrink-0"
              title={t(labels.education.viewCertificate, lang)}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
        {/* Category badge */}
        <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${colorClass}`}>
          {t(categoryLabel, lang)}
        </span>
      </div>
    </div>
  );
}

interface YearSectionProps {
  year: string;
  items: Certification[];
  lang: Language;
  labels: Labels;
  defaultOpen?: boolean;
}

function YearSection({ year, items, lang, labels, defaultOpen = true }: YearSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="relative">
      {/* Year header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 mb-2 group"
      >
        <span className="text-sm font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
          {year}
        </span>
        <span className="text-xs text-surface-400">
          ({items.length} {items.length === 1 ? 'curso' : 'cursos'})
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-surface-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      {/* Timeline line */}
      {isOpen && (
        <div className="ml-[3px] border-l-2 border-surface-200 pl-4">
          {items.map((item) => (
            <CourseTimelineItem
              key={`${item.name}-${item.date}`}
              item={item}
              lang={lang}
              labels={labels}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Education({ data, labels, lang }: EducationProps) {
  const { education, certifications } = data;
  
  // For web: show ALL items (no filter by showInPdf)
  // showInPdf only affects PDF generation, not web display
  const realCertifications = certifications
    .filter(c => c.isCertification === true)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Most recent first
  
  const courses = certifications.filter(c => c.isCertification !== true);

  // Group courses by year
  const coursesByYear = courses.reduce((acc, course) => {
    const year = course.date.split('-')[0];
    if (!acc[year]) acc[year] = [];
    acc[year].push(course);
    return acc;
  }, {} as Record<string, Certification[]>);

  // Sort years descending (most recent first) and sort courses within each year by date
  const sortedYears = Object.entries(coursesByYear)
    .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
    .map(([year, items]) => [
      year,
      items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    ] as [string, Certification[]]);

  return (
    <section id="education" className="py-20 sm:py-28 bg-gradient-to-b from-surface-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold">
            <span className="gradient-text">{t(labels.education.title, lang)}</span>
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full mt-4" />
        </div>

        {/* Education Degrees with Timeline */}
        <div className="mb-12">
          <h3 className="text-lg sm:text-xl font-bold text-surface-800 mb-4 sm:mb-6 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary-500" />
            {t(labels.education.title, lang)}
          </h3>
          <EducationTimeline
            items={education}
            lang={lang}
            labels={labels}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Certifications */}
          {realCertifications.length > 0 && (
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-surface-800 mb-4 sm:mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-accent-500" />
                {t(labels.education.certifications, lang)}
                <span className="text-sm font-normal text-surface-500">({realCertifications.length})</span>
              </h3>
              <div className="grid gap-3">
                {realCertifications.map((item) => (
                  <CertificationCard
                    key={`${item.name}-${item.date}`}
                    item={item}
                    lang={lang}
                    labels={labels}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Courses - Timeline by Year */}
          {courses.length > 0 && (
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-surface-800 mb-4 sm:mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary-500" />
                {t(labels.education.courses, lang)}
                <span className="text-sm font-normal text-surface-500">({courses.length})</span>
              </h3>
              <div className="space-y-4">
                {sortedYears.map(([year, items], index) => (
                  <YearSection
                    key={year}
                    year={year}
                    items={items}
                    lang={lang}
                    labels={labels}
                    defaultOpen={index === 0} // Only most recent year open
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
