import { Code, Languages } from 'lucide-react';
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
    <section id="skills" className="py-20 sm:py-28 bg-gradient-to-b from-surface-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-600 mb-4">
            <Code className="w-4 h-4" />
            <span className="text-sm font-medium">
              {t(labels.skills.title, lang)}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold">
            <span className="gradient-text">{t(labels.skills.title, lang)}</span>
          </h2>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {data.categories.map((category) => (
            <div key={t(category.name, lang)} className="glass-card">
              <h3 className="text-lg font-bold text-surface-800 mb-4">
                {t(category.name, lang)}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium
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
        </div>

        {/* Languages */}
        <div className="max-w-2xl mx-auto">
          <div className="glass-card">
            <h3 className="text-lg font-bold text-surface-800 mb-6 flex items-center gap-2">
              <Languages className="w-5 h-5 text-primary-500" />
              {t(labels.languages.title, lang)}
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              {languages.map((language) => (
                <div
                  key={t(language.name, lang)}
                  className="flex items-center justify-between p-4 rounded-xl bg-surface-50 border border-surface-200"
                >
                  <div>
                    <p className="font-medium text-surface-800">
                      {t(language.name, lang)}
                    </p>
                    <p className="text-sm text-surface-500">
                      {t(language.level, lang)}
                    </p>
                  </div>
                  {language.score && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-600">
                      {language.score}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
