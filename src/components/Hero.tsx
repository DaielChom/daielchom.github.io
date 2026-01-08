import { ChevronDown, Github, Linkedin, Mail, Send } from 'lucide-react';
import type { ResumeData, Labels, Language } from '@/types/resume';

interface HeroProps {
  data: ResumeData;
  labels: Labels;
  lang: Language;
}

function t(obj: { es: string; en: string } | undefined, lang: Language): string {
  if (!obj) return '';
  return obj[lang] || obj.es || '';
}

export function Hero({ data, labels, lang }: HeroProps) {
  const { personal, title, summary } = data;

  const socialIcons: Record<string, React.ReactNode> = {
    github: <Github className="w-5 h-5" />,
    linkedin: <Linkedin className="w-5 h-5" />,
    telegram: <Send className="w-5 h-5" />,
  };

  const mainSocials = ['github', 'linkedin', 'telegram'].filter(
    (key) => personal.links[key as keyof typeof personal.links]
  );

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-200/40 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(13,148,136,0.5) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(13,148,136,0.5) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-20 text-center relative z-10">
        {/* Profile Image */}
        <div className="mb-5 sm:mb-6 animate-fade-in">
          <div className="relative inline-block">
            <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden ring-4 ring-primary-200 ring-offset-4 ring-offset-white shadow-xl">
              <img
                src={`/images/${personal.photo}`}
                alt={personal.name}
                className="w-full h-full object-cover scale-125"
              />
            </div>
            {/* Status indicator */}
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white animate-pulse shadow-lg" title="Disponible" />
          </div>
        </div>

        {/* Name & Title */}
        <div className="mb-3 sm:mb-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-2 sm:mb-3">
            <span className="text-surface-700">{t(labels.header.greeting, lang)} </span>
            <span className="gradient-text">{personal.name}</span>
          </h1>
          <p className="text-xl sm:text-2xl text-primary-600 font-medium">
            {t(title, lang)}
          </p>
        </div>

        {/* Location */}
        <p className="text-sm sm:text-base text-surface-500 mb-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          📍 {t(labels.header.basedIn, lang)} {personal.location.city}, {personal.location.country}
        </p>

        {/* Summary */}
        <p className="text-base sm:text-lg text-surface-600 max-w-2xl mx-auto mb-5 sm:mb-6 px-2 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          {t(summary.short, lang)}
        </p>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          {mainSocials.map((key) => {
            const url = personal.links[key as keyof typeof personal.links];
            return (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 sm:p-3 rounded-full bg-white border border-surface-200 shadow-sm
                         hover:border-primary-400 hover:bg-primary-50 hover:text-primary-600
                         transition-all duration-300 hover:scale-110 hover:shadow-md"
                aria-label={key}
              >
                {socialIcons[key]}
              </a>
            );
          })}
          <a
            href={`mailto:${personal.email}`}
            className="p-2.5 sm:p-3 rounded-full bg-white border border-surface-200 shadow-sm
                     hover:border-primary-400 hover:bg-primary-50 hover:text-primary-600
                     transition-all duration-300 hover:scale-110 hover:shadow-md"
            aria-label="Email"
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Scroll indicator - positioned relative to section, not content */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <a href="#about" className="text-surface-400 hover:text-primary-500 transition-colors">
          <ChevronDown className="w-7 h-7 sm:w-8 sm:h-8" />
        </a>
      </div>
    </section>
  );
}
