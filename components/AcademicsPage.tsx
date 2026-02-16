import React from 'react';
import AnimatedSection from './AnimatedSection';
import LazyImage from './LazyImage';
import { useLanguage } from '../contexts/LanguageContext';
import UpcomingEvents from './UpcomingEvents';

// Define the icons here to keep them co-located with the component.
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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.25278C12 6.25278 10.7439 3.75 8.41008 3.75C6.07628 3.75 4.5 5.11573 4.5 7.58963C4.5 10.0635 6.07628 12.5374 8.41008 15.0113L12 18.75L15.5899 15.0113C17.9237 12.5374 19.5 10.0635 19.5 7.58963C19.5 5.11573 17.9237 3.75 15.5899 3.75C13.2561 3.75 12 6.25278 12 6.25278Z" />
    </svg>
);
const LanguageIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m4 13-4-4m0 0L9 9m4 4v2m-3-6h.01M18 19h.01M15 21h3a2 2 0 002-2v-3a2 2 0 00-2-2h-3v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v10a2 2 0 002 2h3" />
    </svg>
);

interface AcademicsPageProps {
  navigateTo: (page: string) => void;
}

const FeatureCard: React.FC<{ icon: React.ReactElement; title: string; text: string }> = ({ icon, title, text }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className="text-brand-gold mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-brand-blue dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{text}</p>
    </div>
);


const AcademicsPage: React.FC<AcademicsPageProps> = ({ navigateTo }) => {
    const { t } = useLanguage();

     const programs = [
        {
            icon: <ScienceIcon />,
            title: t.scienceTitle,
            description: t.scienceDesc,
            image: t.academicsScienceImage,
        },
        {
            icon: <ArtsIcon />,
            title: t.artsTitle,
            description: t.artsDesc,
            image: t.academicsArtsImage,
        },
        {
            icon: <AthleticsIcon />,
            title: t.athleticsTitle,
            description: t.athleticsDesc,
            image: t.academicsSportsImage,
        },
        {
            icon: <LanguageIcon />,
            title: t.languagesTitle,
            description: t.languagesDesc,
            image: t.academicsLangImage,
        },
    ];

    return (
        <div>
            {/* Hero Section */}
            <section className="relative h-[50vh] flex items-center justify-center text-center text-white bg-cover bg-center" style={{ backgroundImage: `url('${t.academicsPageBackgroundImage}')` }}>
                <div className="absolute inset-0 bg-brand-blue opacity-70"></div>
                <div className="relative z-10 px-4">
                    <AnimatedSection>
                        <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight tracking-wide">{t.academicsPageTitle}</h1>
                        <p className="text-lg md:text-xl max-w-3xl mx-auto mt-4 font-light">{t.academicsPageSubtitle}</p>
                    </AnimatedSection>
                </div>
            </section>
            
            {/* Philosophy Section */}
            <AnimatedSection>
                <section id="philosophy" className="py-20 bg-white dark:bg-gray-900">
                    <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                        <div className="max-w-xl">
                            <h2 className="text-4xl font-serif font-bold text-brand-blue dark:text-white mb-4">{t.academicPhilosophyTitle}</h2>
                            <p className="text-gray-700 dark:text-gray-300 text-lg">{t.academicPhilosophyText}</p>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            <FeatureCard icon={<ScienceIcon />} title={t.coreSubjectsTitle} text={t.coreSubjectsDesc} />
                             <FeatureCard icon={<ArtsIcon />} title={t.electivesTitle} text={t.electivesDesc} />
                             <FeatureCard icon={<AthleticsIcon />} title={t.advancedStudiesTitle} text={t.advancedStudiesDesc} />
                        </div>
                    </div>
                </section>
            </AnimatedSection>

            {/* Program Details Section */}
            <AnimatedSection>
                <section id="programs" className="py-20 bg-brand-light dark:bg-brand-dark">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-serif font-bold text-brand-blue dark:text-white">{t.academicPrograms}</h2>
                            <p className="text-gray-600 dark:text-gray-300 mt-2">{t.academicSubtitle}</p>
                        </div>
                        <div className="space-y-16">
                            {programs.map((program, index) => (
                                <div key={index} className={`flex flex-col md:flex-row items-center gap-12 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                                    <div className="md:w-1/2 rounded-lg overflow-hidden shadow-2xl">
                                        <LazyImage src={program.image} alt={program.title} className="w-full h-full object-cover"/>
                                    </div>
                                    <div className="md:w-1/2">
                                        <div className="text-brand-gold mb-4">{program.icon}</div>
                                        <h3 className="text-3xl font-bold text-brand-blue dark:text-white mb-4">{program.title}</h3>
                                        <p className="text-gray-700 dark:text-gray-300 text-lg">{program.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </AnimatedSection>
            
            {/* Calendar Section */}
            <AnimatedSection>
                {/* The UpcomingEvents component includes its own <section> wrapper and titles */}
                <UpcomingEvents navigateTo={navigateTo} />
            </AnimatedSection>

            {/* CTA to Courses Page */}
            <AnimatedSection>
                <section id="view-courses" className="py-20 bg-brand-gold/10 dark:bg-brand-gold/20">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-4xl font-serif font-bold text-brand-blue dark:text-white">{t.exploreCoursesTitle}</h2>
                        <p className="text-gray-700 dark:text-gray-300 mt-2 text-lg max-w-2xl mx-auto">{t.exploreCoursesSubtitle}</p>
                        <div className="mt-8">
                            <button 
                                onClick={() => navigateTo('courses_page')}
                                className="bg-brand-blue text-white font-bold py-4 px-8 rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
                            >
                                {t.viewCourseCatalog}
                            </button>
                        </div>
                    </div>
                </section>
            </AnimatedSection>

        </div>
    );
};

export default AcademicsPage;