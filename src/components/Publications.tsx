import { BookOpen, ExternalLink } from 'lucide-react';
import type { Publication, Labels, Language } from '@/types/resume';

interface PublicationsProps {
  data: Publication[];
  labels: Labels;
  lang: Language;
}

function t(obj: { es: string; en: string }, lang: Language): string {
  return obj[lang];
}

export function Publications({ data, labels, lang }: PublicationsProps) {
  if (!data || data.length === 0) return null;

  return (
    <section id="publications" className="py-20 sm:py-28 bg-gradient-to-b from-surface-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold">
            <span className="gradient-text">{t(labels.publications.title, lang)}</span>
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full mt-4" />
        </div>

        {/* Publications Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative flex gap-6 lg:gap-10">
            {/* Timeline Column - Only visible on lg screens */}
            <div className="hidden lg:flex flex-col items-center w-16 shrink-0 relative">
              {/* Timeline line */}
              <div className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-primary-400 via-primary-300 to-surface-200" />
              
              {/* Year dots */}
              {data.map((pub, index) => (
                <div
                  key={`timeline-${pub.title}-${pub.year}`}
                  className="relative flex items-center justify-center"
                  style={{
                    marginTop: index === 0 ? '2rem' : 'auto',
                    marginBottom: index === data.length - 1 ? '2rem' : 'auto',
                    flex: 1,
                  }}
                >
                  {/* Dot */}
                  <div className="relative z-10 w-4 h-4 rounded-full bg-white border-2 border-primary-400 shadow-md" />
                  
                  {/* Year label */}
                  <div className="absolute right-full mr-3 whitespace-nowrap">
                    <span className="text-sm font-medium text-surface-500">
                      {pub.year}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Publications Cards Column */}
            <div className="flex-1 space-y-6">
              {data.map((pub, index) => (
                <article
                  key={index}
                  className="glass-card group"
                >
                  {/* Year badge for mobile */}
                  <div className="lg:hidden mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                      <BookOpen className="w-3 h-3" />
                      {pub.year}
                    </span>
                  </div>

                  <div className="flex items-start gap-4">
                    {/* Icon - Hidden on mobile, shown on lg */}
                    <div className="hidden sm:flex shrink-0 p-3 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 text-primary-600">
                      <BookOpen className="w-6 h-6" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-surface-800 group-hover:text-primary-600 transition-colors mb-2 leading-tight">
                        {pub.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-2 text-sm text-surface-500 mb-3">
                        <span className="font-medium text-primary-600">{pub.journal}</span>
                        <span className="hidden lg:inline text-surface-400">•</span>
                        <span className="hidden lg:inline">{pub.year}</span>
                      </div>

                      <p className="text-surface-600 text-sm sm:text-base mb-4">
                        {t(pub.description, lang)}
                      </p>

                      {/* DOI Link */}
                      <a
                        href={pub.doi}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>{t(labels.publications.viewPaper, lang)}</span>
                        <span className="text-surface-400 text-xs">(DOI)</span>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
