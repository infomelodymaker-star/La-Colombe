import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const QuoteSection: React.FC = () => {
    const { t } = useLanguage();

    return (
        <section id="quote" className="py-24 bg-brand-blue text-white">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 max-w-5xl mx-auto">
                    <div className="flex-shrink-0">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/d/d3/Albert_Einstein_Head.jpg"
                            alt={t.einsteinImageAlt}
                            className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover border-4 border-brand-gold shadow-2xl"
                        />
                    </div>
                    <div className="relative text-center md:text-left">
                        <blockquote className="text-2xl md:text-3xl font-serif italic leading-relaxed">
                           "{t.einsteinQuote}"
                        </blockquote>
                        <p className="mt-4 text-right text-lg font-semibold text-brand-gold/90">
                            — {t.einsteinAttribution}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default QuoteSection;
