import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface AdmissionsProps {
  navigateTo: (page: string) => void;
}

const Step: React.FC<{ number: number; title: string; description: string }> = ({ number, title, description }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-brand-gold text-brand-blue rounded-full font-bold text-xl mr-6">
      {number}
    </div>
    <div>
      <h3 className="text-xl font-semibold text-brand-blue dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mt-1">{description}</p>
    </div>
  </div>
);

const Admissions: React.FC<AdmissionsProps> = ({ navigateTo }) => {
  const { t } = useLanguage();

  return (
    <section id="admissions" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-brand-blue dark:text-white">{t.admissionsTitle}</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{t.admissionsSubtitle}</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            <Step number={1} title={t.step1Title} description={t.step1Desc} />
            <Step number={2} title={t.step2Title} description={t.step2Desc} />
            <Step number={3} title={t.step3Title} description={t.step3Desc} />
            <Step number={4} title={t.step4Title} description={t.step4Desc} />
          </div>
          <div className="text-center mt-12">
            <button 
              onClick={() => navigateTo('admissions_page')}
              className="bg-brand-blue text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
            >
              {t.learnMoreAndApply}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Admissions;