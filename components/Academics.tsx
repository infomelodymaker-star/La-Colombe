import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface AcademicCardProps {
  icon: React.ReactElement;
  title: string;
  description: string;
}

const AcademicCard: React.FC<AcademicCardProps> = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
    <div className="text-brand-gold mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-brand-blue dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

const Academics: React.FC = () => {
  const { t } = useLanguage();

  const programs = [
    {
      icon: <ScienceIcon />,
      title: t.scienceTitle,
      description: t.scienceDesc,
    },
    {
      icon: <ArtsIcon />,
      title: t.artsTitle,
      description: t.artsDesc,
    },
    {
      icon: <AthleticsIcon />,
      title: t.athleticsTitle,
      description: t.athleticsDesc,
    },
     {
      icon: <LanguageIcon />,
      title: t.languagesTitle,
      description: t.languagesDesc,
    },
  ];

  return (
    <section id="academics" className="py-20 bg-brand-light dark:bg-brand-dark">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-brand-blue dark:text-white">{t.academicPrograms}</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{t.academicSubtitle}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {programs.map((program, index) => (
            <AcademicCard key={index} {...program} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ScienceIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 00-.517-3.86l-2.387-.477z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8V4m0 8a4 4 0 100-8 4 4 0 000 8z" />
  </svg>
);
const ArtsIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);
const AthleticsIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
const LanguageIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m4 13-4-4m0 0L9 9m4 4v2m-3-6h.01M18 19h.01M15 21h3a2 2 0 002-2v-3a2 2 0 00-2-2h-3v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v10a2 2 0 002 2h3" />
    </svg>
);

export default Academics;