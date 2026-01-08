import { MapPin, Calendar } from 'lucide-react';
import type { NormalizedExperience, Labels, Language } from '@/types/resume';

interface ExperienceProps {
  data: NormalizedExperience[];
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

function getYear(dateStr: string | null): string {
  if (!dateStr) return new Date().getFullYear().toString();
  return dateStr.split('-')[0];
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
    <section id="experience" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold">
            <span className="gradient-text">{t(labels.experience.title, lang)}</span>
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full mt-4" />
        </div>

        {/* Experience with Timeline */}
        <div className="relative">
          {/* Timeline container - Timeline left, Cards right */}
          <div className="flex gap-6 lg:gap-10">
            
            {/* Timeline Column - Only visible on lg screens (LEFT SIDE) */}
            <div className="hidden lg:flex flex-col items-center w-16 shrink-0 relative">
              {/* Timeline line */}
              <div className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-primary-400 via-primary-300 to-surface-200" />
              
              {/* Year dots */}
              {data.map((job, index) => {
                const startYear = getYear(job.startDate);
                const isPresent = !job.endDate;
                
                return (
                  <div
                    key={`timeline-${job.company}-${job.startDate}`}
                    className="relative flex items-center justify-center"
                    style={{
                      marginTop: index === 0 ? '2rem' : 'auto',
                      marginBottom: index === data.length - 1 ? '2rem' : 'auto',
                      flex: 1,
                    }}
                  >
                    {/* Dot */}
                    <div className={`relative z-10 w-4 h-4 rounded-full shadow-md ${
                      isPresent 
                        ? 'bg-primary-500 ring-4 ring-primary-100' 
                        : 'bg-white border-2 border-primary-400'
                    }`}>
                      {isPresent && (
                        <div className="absolute inset-0 rounded-full bg-primary-500 animate-ping opacity-25" />
                      )}
                    </div>
                    
                    {/* Year label - Now on the LEFT of the dot */}
                    <div className="absolute right-full mr-3 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        isPresent ? 'text-primary-600' : 'text-surface-500'
                      }`}>
                        {isPresent ? (lang === 'es' ? 'Presente' : 'Present') : startYear}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cards Column (RIGHT SIDE) */}
            <div className="flex-1 space-y-6">
              {data.map((job) => (
                <div
                  key={`${job.company}-${job.startDate}`}
                  className="relative"
                >
                  {/* Connector line to timeline (hidden on mobile) */}
                  <div className="hidden lg:block absolute top-8 left-0 w-6 lg:w-10 h-px bg-gradient-to-l from-surface-200 to-primary-300 -translate-x-full" />

                  {/* Card */}
                  <div className="glass-card group">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-surface-800 group-hover:text-primary-600 transition-colors">
                          {job.company}
                        </h3>
                        <p className="text-primary-600 font-medium">
                          {t(job.title, lang)}
                        </p>
                      </div>
                      
                      {/* Date badge - visible on mobile, hidden on lg when timeline shows year */}
                      <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-surface-500">
                        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-surface-100">
                          <Calendar className="w-3 h-3" />
                          <span className="whitespace-nowrap">
                            {formatDate(job.startDate, lang)} — {formatDate(job.endDate, lang)}
                          </span>
                        </span>
                        <span className="hidden xs:inline text-surface-400">
                          ({calculateDuration(job.startDate, job.endDate, lang)})
                        </span>
                      </div>
                    </div>

                    {/* Location */}
                    {job.location && (
                      <div className="flex items-center gap-1 text-sm text-surface-500 mb-4">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                    )}

                    {/* Highlights */}
                    <ul className="space-y-2 mb-4">
                      {job.highlights[lang].map((highlight, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm sm:text-base text-surface-600">
                          <span className="text-primary-500 mt-1 shrink-0">▹</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Keywords */}
                    {job.keywords && job.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-surface-100">
                        {job.keywords.slice(0, 6).map((keyword) => (
                          <span key={keyword} className="tag text-xs">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
