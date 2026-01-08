import { Languages } from 'lucide-react';
import type { Skills as SkillsType, LanguageSkill, Labels, Language } from '@/types/resume';

interface SkillsProps {
  data: SkillsType;
  languages: LanguageSkill[];
  labels: Labels;
  lang: Language;
}

function t(obj: { es: string; en: string }, lang: Language): string {
  return obj[lang];
}

export function Skills({ data, languages, labels, lang }: SkillsProps) {
  return (
    <section id="skills" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold">
            <span className="gradient-text">{t(labels.skills.title, lang)}</span>
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full mt-4" />
        </div>

        {/* Skills Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {data.categories.map((category) => (
            <div key={t(category.name, lang)} className="glass-card">
              <h3 className="text-base sm:text-lg font-bold text-surface-800 mb-3 sm:mb-4">
                {t(category.name, lang)}
              </h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {category.items.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium
                             bg-gradient-to-r from-surface-100 to-surface-50
                             border border-surface-200
                             text-surface-700
                             hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50
                             transition-all duration-200 cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* Languages - Same card style as skills */}
          <div className="glass-card">
            <h3 className="text-base sm:text-lg font-bold text-surface-800 mb-3 sm:mb-4 flex items-center gap-2">
              <Languages className="w-5 h-5 text-primary-500" />
              {t(labels.languages.title, lang)}
            </h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {languages.map((language) => (
                <span
                  key={t(language.name, lang)}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium
                           bg-gradient-to-r from-surface-100 to-surface-50
                           border border-surface-200
                           text-surface-700
                           hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50
                           transition-all duration-200 cursor-default"
                >
                  {t(language.name, lang)} ({t(language.level, lang)})
                  {language.score && ` • ${language.score}`}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
