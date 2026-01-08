import { MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import type { ResumeData, Labels, Language } from '@/types/resume';

interface AboutProps {
  data: ResumeData;
  labels: Labels;
  lang: Language;
}

function t(obj: { es: string; en: string } | undefined, lang: Language): string {
  if (!obj) return '';
  return obj[lang] || obj.es || '';
}

export function About({ data, labels, lang }: AboutProps) {
  const { personal, summary } = data;

  return (
    <section id="about" className="py-20 sm:py-28 bg-gradient-to-b from-surface-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold">
            <span className="gradient-text">{t(labels.about.title, lang)}</span>
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full mt-4" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Bio Card */}
          <div className="lg:col-span-2 glass-card">
            <p className="text-base sm:text-lg text-surface-700 leading-relaxed">
              {t(summary.full, lang)}
            </p>
          </div>

          {/* Contact Info Card */}
          <div className="glass-card">
            <h3 className="text-base sm:text-lg font-semibold text-surface-800 mb-4 sm:mb-6">
              {t(labels.about.contactDetails, lang)}
            </h3>

            <div className="space-y-3 sm:space-y-4">
              {/* Location */}
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-primary-100 text-primary-600 shrink-0">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-surface-700 font-medium text-sm sm:text-base">
                    {personal.location.city}
                  </p>
                  <p className="text-surface-500 text-xs sm:text-sm">
                    {personal.location.state}, {personal.location.country}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-primary-100 text-primary-600 shrink-0">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <a
                    href={`mailto:${personal.email}`}
                    className="text-surface-700 hover:text-primary-600 transition-colors break-all text-sm sm:text-base"
                  >
                    {personal.email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-primary-100 text-primary-600 shrink-0">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <a
                    href={`tel:${personal.phone}`}
                    className="text-surface-700 hover:text-primary-600 transition-colors text-sm sm:text-base"
                  >
                    {personal.phone}
                  </a>
                </div>
              </div>

              {/* Website */}
              {personal.links.website && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-primary-100 text-primary-600 shrink-0">
                    <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <a
                      href={personal.links.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-surface-700 hover:text-primary-600 transition-colors text-sm sm:text-base break-all"
                    >
                      {personal.links.website.replace('https://', '')}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
