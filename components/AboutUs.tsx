import React from 'react';
import LazyImage from './LazyImage';
import { useLanguage } from '../contexts/LanguageContext';

interface AboutUsProps {
  navigateTo: (page: string) => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ navigateTo }) => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-brand-blue dark:text-white">{t.aboutLaColombe}</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{t.aboutSubtitle}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="rounded-lg overflow-hidden shadow-2xl">
            <LazyImage src={t.aboutUsImage} alt="School Campus" className="w-full h-full object-cover"/>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-brand-blue dark:text-white mb-4">{t.ourMission}</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {t.missionText}
            </p>
            <h3 className="text-2xl font-bold text-brand-blue dark:text-white mb-4">{t.ourVision}</h3>
            <p className="text-gray-700 dark:text-gray-300">
              {t.visionText}
            </p>
            <button 
              onClick={() => navigateTo('about_page')}
              className="mt-6 bg-brand-blue text-white font-bold py-3 px-6 rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
            >
              {t.learnMore}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;