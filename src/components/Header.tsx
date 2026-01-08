import { useState, useEffect, useRef } from 'react';
import { Menu, X, Globe, Download, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { Labels, Language } from '@/types/resume';

interface HeaderProps {
  labels: Labels;
}

function t(obj: { es: string; en: string } | undefined, lang: Language): string {
  if (!obj) return '';
  return obj[lang] || obj.es || '';
}

// CV download options
const cvOptions = [
  { 
    id: 'hybrid', 
    label: { es: 'General (Híbrido)', en: 'General (Hybrid)' },
    description: { es: 'Data Scientist & Engineer', en: 'Data Scientist & Engineer' }
  },
  { 
    id: 'de', 
    label: { es: 'Data Engineer', en: 'Data Engineer' },
    description: { es: 'Enfocado en ETLs y arquitectura', en: 'Focused on ETLs and architecture' }
  },
  { 
    id: 'ds', 
    label: { es: 'Data Scientist', en: 'Data Scientist' },
    description: { es: 'Enfocado en ML y análisis', en: 'Focused on ML and analysis' }
  },
];

export function Header({ labels }: HeaderProps) {
  const { language, toggleLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCvDropdownOpen, setIsCvDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCvDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { href: '#home', label: t(labels.navigation.home, language) },
    { href: '#about', label: t(labels.navigation.about, language) },
    { href: '#experience', label: t(labels.navigation.experience, language) },
    { href: '#education', label: t(labels.navigation.education, language) },
    { href: '#skills', label: t(labels.navigation.skills, language) },
    { href: '#publications', label: t(labels.navigation.publications, language) },
  ];

  const getCvFileName = (profile: string, lang: Language) => {
    const profileNames: Record<string, string> = {
      hybrid: 'Hybrid',
      de: 'DataEngineer',
      ds: 'DataScientist',
    };
    return `CV_Daniel_Carvajal_${profileNames[profile] || profile}_${lang.toUpperCase()}.pdf`;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-xl border-b border-surface-200 py-3 shadow-sm'
          : 'bg-transparent py-5'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a 
            href="#home" 
            className="text-xl font-display font-bold gradient-text hover:opacity-80 transition-opacity"
          >
            DC
          </a>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="btn-ghost text-sm capitalize"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Download CV Dropdown */}
            <div className="relative hidden sm:block" ref={dropdownRef}>
              <button
                onClick={() => setIsCvDropdownOpen(!isCvDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                         bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium
                         hover:from-primary-600 hover:to-primary-700
                         transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Download className="w-4 h-4" />
                <span className="hidden lg:inline">{t(labels.header.downloadCv, language)}</span>
                <span className="lg:hidden">CV</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isCvDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isCvDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-surface-200 py-2 animate-fade-in z-50">
                  <div className="px-3 py-2 border-b border-surface-100">
                    <p className="text-xs text-surface-500 font-medium uppercase tracking-wide">
                      {language === 'es' ? 'Selecciona versión' : 'Select version'}
                    </p>
                  </div>
                  
                  {cvOptions.map((option) => (
                    <div key={option.id} className="px-2 py-1">
                      <div className="px-2 py-1.5 text-xs text-surface-400 font-medium">
                        {t(option.label, language)}
                      </div>
                      <div className="flex gap-1">
                        <a
                          href={`/cv/${getCvFileName(option.id, 'es')}`}
                          download
                          onClick={() => setIsCvDropdownOpen(false)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg
                                   text-sm text-surface-700 hover:bg-primary-50 hover:text-primary-600
                                   transition-colors border border-surface-200"
                        >
                          <span>🇪🇸</span>
                          <span>Español</span>
                        </a>
                        <a
                          href={`/cv/${getCvFileName(option.id, 'en')}`}
                          download
                          onClick={() => setIsCvDropdownOpen(false)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg
                                   text-sm text-surface-700 hover:bg-primary-50 hover:text-primary-600
                                   transition-colors border border-surface-200"
                        >
                          <span>🇺🇸</span>
                          <span>English</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                       bg-white border border-surface-300
                       hover:border-primary-400 hover:text-primary-600
                       transition-all duration-200 shadow-sm"
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4" />
              <span className="font-medium uppercase">{language}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-surface-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-surface-200 pt-4 animate-fade-in">
            <ul className="flex flex-col gap-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2 rounded-lg text-surface-700 hover:text-primary-600 hover:bg-primary-50 transition-colors capitalize"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* CV Downloads in Mobile */}
            <div className="mt-4 pt-4 border-t border-surface-200">
              <p className="px-4 text-xs text-surface-500 font-medium uppercase tracking-wide mb-2">
                {t(labels.header.downloadCv, language)}
              </p>
              
              {cvOptions.map((option) => (
                <div key={option.id} className="px-4 py-2">
                  <p className="text-sm font-medium text-surface-700 mb-2">{t(option.label, language)}</p>
                  <div className="flex gap-2">
                    <a
                      href={`/cv/${getCvFileName(option.id, 'es')}`}
                      download
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg
                               text-sm text-surface-600 bg-surface-100 hover:bg-primary-50 hover:text-primary-600
                               transition-colors"
                    >
                      <span>🇪🇸</span>
                      <span>ES</span>
                    </a>
                    <a
                      href={`/cv/${getCvFileName(option.id, 'en')}`}
                      download
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg
                               text-sm text-surface-600 bg-surface-100 hover:bg-primary-50 hover:text-primary-600
                               transition-colors"
                    >
                      <span>🇺🇸</span>
                      <span>EN</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
