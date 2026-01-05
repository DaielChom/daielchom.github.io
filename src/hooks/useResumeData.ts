import { useState, useEffect, useCallback } from 'react';
import yaml from 'js-yaml';
import type { ResumeData, Labels, Language } from '@/types/resume';

interface UseResumeDataReturn {
  resumeData: ResumeData | null;
  labels: Labels | null;
  language: Language;
  setLanguage: (lang: Language) => void;
  loading: boolean;
  error: string | null;
}

export function useResumeData(): UseResumeDataReturn {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [labels, setLabels] = useState<Labels | null>(null);
  const [language, setLanguage] = useState<Language>('es');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Load YAML files
      const [resumeResponse, labelsResponse] = await Promise.all([
        fetch('/data/resume.yaml'),
        fetch('/data/labels.yaml'),
      ]);

      if (!resumeResponse.ok || !labelsResponse.ok) {
        throw new Error('Failed to load data files');
      }

      const [resumeText, labelsText] = await Promise.all([
        resumeResponse.text(),
        labelsResponse.text(),
      ]);

      const resumeYaml = yaml.load(resumeText) as ResumeData;
      const labelsYaml = yaml.load(labelsText) as Labels;

      setResumeData(resumeYaml);
      setLabels(labelsYaml);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error loading resume data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Update HTML lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return {
    resumeData,
    labels,
    language,
    setLanguage,
    loading,
    error,
  };
}

// Helper function to get localized string
export function t(localizedString: { es: string; en: string } | undefined, lang: Language): string {
  if (!localizedString) return '';
  return localizedString[lang] || localizedString.es || '';
}

// Helper function to format date
export function formatDate(dateStr: string | null, lang: Language): string {
  if (!dateStr) {
    return lang === 'es' ? 'Presente' : 'Present';
  }

  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short' };
  
  return date.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', options);
}

// Helper to format date range
export function formatDateRange(startDate: string, endDate: string | null, lang: Language): string {
  const start = formatDate(startDate, lang);
  const end = formatDate(endDate, lang);
  return `${start} - ${end}`;
}

