import { Heart, Github, Linkedin, Mail, Send, Twitter, Instagram } from 'lucide-react';
import type { Personal, Labels, Language } from '@/types/resume';

interface FooterProps {
  data: Personal;
  labels: Labels;
  lang: Language;
}

function t(obj: { es: string; en: string }, lang: Language): string {
  return obj[lang];
}

const socialIcons: Record<string, React.ReactNode> = {
  github: <Github className="w-5 h-5" />,
  linkedin: <Linkedin className="w-5 h-5" />,
  twitter: <Twitter className="w-5 h-5" />,
  telegram: <Send className="w-5 h-5" />,
  instagram: <Instagram className="w-5 h-5" />,
};

export function Footer({ data, labels, lang }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const socialLinks = Object.entries(data.links)
    .filter(([key, value]) => value && socialIcons[key])
    .map(([key, url]) => ({
      name: key,
      url: url as string,
      icon: socialIcons[key],
    }));

  return (
    <footer className="py-8 sm:py-12 border-t border-surface-200 bg-surface-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          {/* Social Links */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:p-2.5 rounded-full bg-white border border-surface-200 shadow-sm
                         text-surface-500 hover:text-primary-600 hover:border-primary-300
                         transition-all duration-200 hover:scale-110 hover:shadow-md"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
            <a
              href={`mailto:${data.email}`}
              className="p-2 sm:p-2.5 rounded-full bg-white border border-surface-200 shadow-sm
                       text-surface-500 hover:text-primary-600 hover:border-primary-300
                       transition-all duration-200 hover:scale-110 hover:shadow-md"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>

          {/* Made with */}
          <p className="text-surface-500 text-xs sm:text-sm flex flex-wrap items-center justify-center gap-1.5 text-center px-4">
            {t(labels.footer.madeWith, lang)}{' '}
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />{' '}
            {t(labels.footer.and, lang)} React + TypeScript + Tailwind
          </p>

          {/* Copyright */}
          <p className="text-surface-400 text-xs sm:text-sm text-center">
            © {currentYear} {data.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
