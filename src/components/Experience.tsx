import { Briefcase, MapPin, Calendar } from 'lucide-react';
import type { Experience as ExperienceType, Labels, Language } from '@/types/resume';

interface ExperienceProps {
  data: ExperienceType[];
  labels: Labels;
  lang: Language;
}

function t(obj: { es: string; en: string }, lang: Language): string {
  return obj[lang];
}

function formatDate(dateStr: string | null, lang: Language): string {
  if (!dateStr) {
    return lang === 'es' ? 'Presente' : 'Present';
  }
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short' };
  return date.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', options);
}

function calculateDuration(startDate: string, endDate: string | null, lang: Language): string {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (lang === 'es') {
    if (years > 0 && remainingMonths > 0) {
      return `${years} año${years > 1 ? 's' : ''} ${remainingMonths} mes${remainingMonths > 1 ? 'es' : ''}`;
    } else if (years > 0) {
      return `${years} año${years > 1 ? 's' : ''}`;
    }
    return `${remainingMonths} mes${remainingMonths > 1 ? 'es' : ''}`;
  } else {
    if (years > 0 && remainingMonths > 0) {
      return `${years} yr${years > 1 ? 's' : ''} ${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}`;
    } else if (years > 0) {
      return `${years} yr${years > 1 ? 's' : ''}`;
    }
    return `${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}`;
  }
}

export function Experience({ data, labels, lang }: ExperienceProps) {
  return (
    <section id="experience" className="py-20 sm:py-28 bg-gradient-to-b from-surface-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-600 mb-4">
            <Briefcase className="w-4 h-4" />
            <span className="text-sm font-medium">
              {t(labels.experience.title, lang)}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold">
            <span className="gradient-text">{t(labels.experience.title, lang)}</span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary-400 via-primary-300 to-transparent md:-translate-x-px" />

          {data.map((job, index) => (
            <div
              key={`${job.company}-${job.startDate}`}
              className={`relative flex flex-col md:flex-row gap-8 mb-12 last:mb-0 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-primary-500 ring-4 ring-white md:-translate-x-1/2 z-10 shadow-md" />

              {/* Content */}
              <div className={`flex-1 ml-8 md:ml-0 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                <div className="glass-card group">
                  {/* Header */}
                  <div className={`flex flex-col gap-2 mb-4 ${index % 2 === 0 ? 'md:items-end' : 'md:items-start'}`}>
                    <h3 className="text-xl font-bold text-surface-800 group-hover:text-primary-600 transition-colors">
                      {job.company}
                    </h3>
                    <p className="text-primary-600 font-medium">
                      {t(job.title, lang)}
                    </p>
                    
                    <div className={`flex flex-wrap items-center gap-4 text-sm text-surface-500 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(job.startDate, lang)} — {formatDate(job.endDate, lang)}
                      </span>
                      <span className="text-surface-400">•</span>
                      <span>{calculateDuration(job.startDate, job.endDate, lang)}</span>
                      {job.location && (
                        <>
                          <span className="text-surface-400 hidden sm:inline">•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Highlights */}
                  <ul className={`space-y-2 ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                    {job.highlights[lang].map((highlight, i) => (
                      <li key={i} className="flex items-start gap-2 text-surface-600">
                        <span className={`text-primary-500 mt-1.5 ${index % 2 === 0 ? 'md:order-2' : ''}`}>▹</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Keywords */}
                  {job.keywords && job.keywords.length > 0 && (
                    <div className={`flex flex-wrap gap-2 mt-4 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                      {job.keywords.slice(0, 5).map((keyword) => (
                        <span key={keyword} className="tag text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Empty space for timeline alignment */}
              <div className="hidden md:block flex-1" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
