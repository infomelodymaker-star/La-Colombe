import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroProps {
  navigateTo: (page: string, anchor?: string) => void;
}

const Hero: React.FC<HeroProps> = ({ navigateTo }) => {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative h-screen flex items-center justify-center text-center text-white bg-cover bg-center" style={{ backgroundImage: `url('${t.heroBackgroundImage}')` }}>
      <div className="absolute inset-0 bg-brand-blue opacity-60"></div>
      <div className="relative z-10 px-4">
        <h1 
            className="text-5xl md:text-7xl font-serif font-bold mb-4 leading-tight tracking-wide"
            dangerouslySetInnerHTML={{ __html: t.heroTitle }}
        >
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 font-light">
          {t.heroSubtitle}
        </p>
        <button 
          onClick={() => navigateTo('admissions_page', '#apply')}
          className="bg-brand-gold text-brand-blue font-bold py-3 px-8 rounded-full hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105"
        >
          {t.applyNow}
        </button>
      </div>
    </section>
  );
};

export default Hero;