import React from 'react';
import AnimatedSection from './AnimatedSection';
import LazyImage from './LazyImage';
import { useLanguage } from '../contexts/LanguageContext';

const AboutPage: React.FC = () => {
    const { t } = useLanguage();

    const facultyMembers = [
        { name: t.faculty1Name, title: t.faculty1Title, image: t.faculty1Image, bio: t.faculty1Bio },
        { name: t.faculty2Name, title: t.faculty2Title, image: t.faculty2Image, bio: t.faculty2Bio },
        { name: t.faculty3Name, title: t.faculty3Title, image: t.faculty3Image, bio: t.faculty3Bio },
    ];

    const facilities = [
        { name: t.facility1Name, image: t.facility1Image, description: t.facility1Desc },
        { name: t.facility2Name, image: t.facility2Image, description: t.facility2Desc },
        { name: t.facility3Name, image: t.facility3Image, description: t.facility3Desc },
        { name: t.facility4Name, image: t.facility4Image, description: t.facility4Desc },
    ];

    return (
        <div>
            {/* Hero Section */}
            <section className="relative h-[50vh] flex items-center justify-center text-center text-white bg-cover bg-center" style={{ backgroundImage: `url('${t.aboutPageBackgroundImage}')` }}>
                <div className="absolute inset-0 bg-brand-blue opacity-70"></div>
                <div className="relative z-10 px-4">
                    <AnimatedSection>
                        <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight tracking-wide">
                            {t.aboutPageTitle}
                        </h1>
                        <p className="text-lg md:text-xl max-w-3xl mx-auto mt-4 font-light">
                            {t.aboutPageSubtitle}
                        </p>
                    </AnimatedSection>
                </div>
            </section>
            
            {/* History Section */}
            <AnimatedSection>
                <section id="history" className="py-20 bg-white dark:bg-gray-800">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-serif font-bold text-brand-blue dark:text-white">{t.historyTitle}</h2>
                            <p className="text-gray-600 dark:text-gray-300 mt-2">{t.historySubtitle}</p>
                        </div>
                        <div className="max-w-4xl mx-auto text-gray-700 dark:text-gray-300 text-lg space-y-4 text-justify">
                            <p>
                                {t.historyPara1}
                            </p>
                             <p>
                                {t.historyPara2}
                            </p>
                        </div>
                    </div>
                </section>
            </AnimatedSection>

            {/* Motto Section */}
            <AnimatedSection>
                <section id="motto" className="py-16 bg-brand-gold/10 dark:bg-brand-gold/20">
                    <div className="container mx-auto px-6 text-center">
                        <h3 className="text-3xl md:text-4xl font-serif text-brand-blue dark:text-white italic tracking-wider">
                            {t.motto}
                        </h3>
                        <div className="w-24 h-px bg-brand-gold mx-auto my-4"></div>
                        <p className="text-lg text-gray-700 dark:text-gray-300">
                            {t.mottoTranslation}
                        </p>
                    </div>
                </section>
            </AnimatedSection>

            {/* Meet Our Faculty Section */}
            <AnimatedSection>
                 <section id="faculty" className="py-20 bg-brand-light dark:bg-brand-dark">
                    <div className="container mx-auto px-6">
                         <div className="text-center mb-12">
                            <h2 className="text-4xl font-serif font-bold text-brand-blue dark:text-white">{t.leadershipTitle}</h2>
                            <p className="text-gray-600 dark:text-gray-300 mt-2">{t.leadershipSubtitle}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {facultyMembers.map((member, index) => (
                                <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                                    <LazyImage src={member.image} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-brand-gold object-cover" />
                                    <h3 className="text-xl font-bold text-brand-blue dark:text-white">{member.name}</h3>
                                    <p className="text-brand-gold font-semibold mb-3">{member.title}</p>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">{member.bio}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </AnimatedSection>

            {/* Our Facilities Section */}
            <AnimatedSection>
                <section id="facilities" className="py-20 bg-white dark:bg-gray-800">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-serif font-bold text-brand-blue dark:text-white">{t.facilitiesTitle}</h2>
                            <p className="text-gray-600 dark:text-gray-300 mt-2">{t.facilitiesSubtitle}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {facilities.map((facility, index) => (
                                <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg aspect-[4/3] bg-gray-200 dark:bg-gray-700">
                                    <LazyImage src={facility.image} alt={facility.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end">
                                        <div className="p-4 text-white">
                                            <h3 className="text-xl font-bold">{facility.name}</h3>
                                            <p className="text-sm">{facility.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </AnimatedSection>
        </div>
    );
};

export default AboutPage;