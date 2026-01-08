import { useEffect, useState } from 'react';
import yaml from 'js-yaml';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';
import type { ResumeData, ResumeDataRaw, Labels, TitlesData } from '@/types/resume';
import { normalizeResumeData } from '@/types/resume';

// Components
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Experience } from '@/components/Experience';
import { Education } from '@/components/Education';
import { Skills } from '@/components/Skills';
import { Publications } from '@/components/Publications';
import { Footer } from '@/components/Footer';
import { LoadingScreen } from '@/components/LoadingScreen';

function AppContent() {
  const { language } = useLanguage();
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [labels, setLabels] = useState<Labels | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [resumeRes, labelsRes, titlesRes] = await Promise.all([
          fetch('/data/resume.yaml'),
          fetch('/data/labels.yaml'),
          fetch('/data/titles.json'),
        ]);

        if (!resumeRes.ok || !labelsRes.ok || !titlesRes.ok) {
          throw new Error('Failed to load data');
        }

        const [resumeText, labelsText, titlesJson] = await Promise.all([
          resumeRes.text(),
          labelsRes.text(),
          titlesRes.json() as Promise<TitlesData>,
        ]);

        // Load raw data and normalize for 'hybrid' profile (web default)
        const rawData = yaml.load(resumeText) as ResumeDataRaw;
        const normalizedData = normalizeResumeData(rawData, titlesJson, 'hybrid');

        setResumeData(normalizedData);
        setLabels(yaml.load(labelsText) as Labels);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading data');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !resumeData || !labels) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Error</h1>
          <p className="text-surface-500">{error || 'Failed to load data'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pattern-overlay">
      <Header labels={labels} />
      
      <main>
        <Hero 
          data={resumeData} 
          labels={labels} 
          lang={language} 
        />
        
        <About 
          data={resumeData} 
          labels={labels} 
          lang={language} 
        />
        
        <Experience 
          data={resumeData.experience} 
          labels={labels} 
          lang={language} 
        />
        
        <Education 
          data={resumeData} 
          labels={labels} 
          lang={language} 
        />
        
        <Skills 
          data={resumeData.skills} 
          languages={resumeData.languages}
          labels={labels} 
          lang={language} 
        />

        <Publications
          data={resumeData.publications}
          labels={labels}
          lang={language}
        />
      </main>
      
      <Footer 
        data={resumeData.personal} 
        labels={labels} 
        lang={language} 
      />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
