import { MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import type { ResumeData, Labels, Language } from '@/types/resume';

interface AboutProps {
  data: ResumeData;
  labels: Labels;
  lang: Language;
}

function t(obj: { es: string; en: string }, lang: Language): string {
  return obj[lang];
}

export function About({ data, labels, lang }: AboutProps) {
  const { personal, summary } = data;

  return (
    <section id="about" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            <span className="gradient-text">{t(labels.about.title, lang)}</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Bio Card */}
          <div className="lg:col-span-2 glass-card">
            <p className="text-lg text-surface-700 leading-relaxed">
              {t(summary.full, lang)}
            </p>
          </div>

          {/* Contact Info Card */}
          <div className="glass-card">
            <h3 className="text-lg font-semibold text-surface-800 mb-6">
              {t(labels.about.contactDetails, lang)}
            </h3>

            <div className="space-y-4">
              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary-100 text-primary-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-surface-700 font-medium">
                    {personal.location.city}
                  </p>
                  <p className="text-surface-500 text-sm">
                    {personal.location.state}, {personal.location.country}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary-100 text-primary-600">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <a
                    href={`mailto:${personal.email}`}
                    className="text-surface-700 hover:text-primary-600 transition-colors break-all"
                  >
                    {personal.email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary-100 text-primary-600">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <a
                    href={`tel:${personal.phone}`}
                    className="text-surface-700 hover:text-primary-600 transition-colors"
                  >
                    {personal.phone}
                  </a>
                </div>
              </div>

              {/* Website */}
              {personal.links.website && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary-100 text-primary-600">
                    <ExternalLink className="w-5 h-5" />
                  </div>
                  <div>
                    <a
                      href={personal.links.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-surface-700 hover:text-primary-600 transition-colors"
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
