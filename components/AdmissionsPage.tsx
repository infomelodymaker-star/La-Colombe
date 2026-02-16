import React, { useState } from 'react';
import AnimatedSection from './AnimatedSection';
import { useLanguage } from '../contexts/LanguageContext';
import { CalendarIcon, DollarSignIcon, QuestionIcon, ChevronDownIcon } from './icons/InfoIcons';

interface AdmissionsPageProps {
  navigateTo: (page: string) => void;
}

const Step: React.FC<{ number: number; title: string; description: string }> = ({ number, title, description }) => (
    <div className="flex items-start mb-8">
        <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-brand-gold text-brand-blue rounded-full font-bold text-2xl mr-6 shadow-lg">
            {number}
        </div>
        <div>
            <h3 className="text-2xl font-semibold text-brand-blue dark:text-white">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">{description}</p>
        </div>
    </div>
);

const FAQItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-200 dark:border-gray-700 py-4">
            <button
                className="w-full flex justify-between items-center text-left text-lg font-semibold text-brand-blue dark:text-white"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <span>{q}</span>
                <ChevronDownIcon className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}>
                <p className="text-gray-700 dark:text-gray-300 pr-6">{a}</p>
            </div>
        </div>
    );
};

const InfoCard: React.FC<{icon: React.ReactElement<{ className?: string }>, title: string, text: string}> = ({icon, title, text}) => (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
        <div className="text-brand-gold mb-4 mx-auto w-16 h-16 flex items-center justify-center bg-brand-blue rounded-full">
            {React.cloneElement(icon, { className: "w-8 h-8 text-brand-gold" })}
        </div>
        <h3 className="text-2xl font-bold text-brand-blue dark:text-white mb-3">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{text}</p>
    </div>
);


const AdmissionsPage: React.FC<AdmissionsPageProps> = ({ navigateTo }) => {
    const { t } = useLanguage();

    const faqs = [
        { q: t.faqQ1, a: t.faqA1 },
        { q: t.faqQ2, a: t.faqA2 },
        { q: t.faqQ3, a: t.faqA3 },
        { q: t.faqQ4, a: t.faqA4 },
    ];

    return (
        <div>
            {/* Hero Section */}
            <section className="relative h-[50vh] flex items-center justify-center text-center text-white bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/seed/admissions-hero/1920/1080')" }}>
                <div className="absolute inset-0 bg-brand-blue opacity-70"></div>
                <div className="relative z-10 px-4">
                    <AnimatedSection>
                        <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight tracking-wide">{t.admissionsPageTitle}</h1>
                        <p className="text-lg md:text-xl max-w-3xl mx-auto mt-4 font-light">{t.admissionsPageSubtitle}</p>
                    </AnimatedSection>
                </div>
            </section>

            {/* Application Process Section */}
            <AnimatedSection>
                <section id="process" className="py-20 bg-white dark:bg-gray-800">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-serif font-bold text-brand-blue dark:text-white">{t.applicationProcessTitle}</h2>
                            <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">{t.applicationProcessSubtitle}</p>
                        </div>
                        <div className="max-w-4xl mx-auto">
                            <Step number={1} title={t.step1Title} description={t.step1Desc} />
                            <Step number={2} title={t.step2Title} description={t.step2Desc} />
                            <Step number={3} title={t.step3Title} description={t.step3Desc} />
                            <Step number={4} title={t.step4Title} description={t.step4Desc} />
                        </div>
                    </div>
                </section>
            </AnimatedSection>

            {/* Tuition and Aid Section */}
            <AnimatedSection>
                <section id="tuition" className="py-20 bg-brand-light dark:bg-brand-dark">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-serif font-bold text-brand-blue dark:text-white">{t.tuitionAndAidTitle}</h2>
                            <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">{t.tuitionAndAidSubtitle}</p>
                        </div>
                        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                           <InfoCard icon={<DollarSignIcon />} title={t.tuitionDetails.split(' ')[2]} text={t.tuitionDetails} />
                           <InfoCard icon={<CalendarIcon />} title="Financial Aid" text={t.financialAidDetails} />
                           <InfoCard icon={<QuestionIcon />} title="Scholarships" text={t.scholarshipDetails} />
                        </div>
                    </div>
                </section>
            </AnimatedSection>

            {/* FAQ Section */}
            <AnimatedSection>
                <section id="faq" className="py-20 bg-white dark:bg-gray-800">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-serif font-bold text-brand-blue dark:text-white">{t.faqTitle}</h2>
                            <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">{t.faqSubtitle}</p>
                        </div>
                        <div className="max-w-4xl mx-auto">
                            {faqs.map((faq, index) => (
                                <FAQItem key={index} q={faq.q} a={faq.a} />
                            ))}
                        </div>
                    </div>
                </section>
            </AnimatedSection>

             {/* CTA Section */}
            <AnimatedSection>
                <section id="apply" className="py-20 bg-brand-gold/10 dark:bg-brand-gold/20">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-4xl font-serif font-bold text-brand-blue dark:text-white">{t.readyToApplyTitle}</h2>
                        <p className="text-gray-700 dark:text-gray-300 mt-2 text-lg max-w-2xl mx-auto">{t.readyToApplySubtitle}</p>
                        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                            <button 
                                onClick={() => navigateTo('application')}
                                className="bg-brand-blue text-white font-bold py-4 px-8 rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
                            >
                                {t.applyOnlineBtn}
                            </button>
                            <a href="#" className="bg-white border-2 border-brand-blue text-brand-blue font-bold py-4 px-8 rounded-full hover:bg-brand-blue hover:text-white transition-all duration-300 dark:bg-transparent dark:text-brand-light dark:hover:bg-brand-light dark:hover:text-brand-dark">
                                {t.scheduleTourBtn}
                            </a>
                        </div>
                    </div>
                </section>
            </AnimatedSection>
        </div>
    );
};

export default AdmissionsPage;