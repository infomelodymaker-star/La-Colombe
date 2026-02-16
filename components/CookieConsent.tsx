import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const CookieConsent: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { t, language } = useLanguage();

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (consent !== 'true') {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'true');
        localStorage.setItem('language', language);
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div 
            className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-brand-blue/90 backdrop-blur-sm text-white transform transition-transform duration-500 ease-in-out"
            style={{ transform: isVisible ? 'translateY(0)' : 'translateY(100%)' }}
            role="dialog"
            aria-labelledby="cookie-consent-title"
        >
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                    <h2 id="cookie-consent-title" className="font-bold text-lg">{t.cookieConsentTitle}</h2>
                    <p className="text-sm text-gray-300">{t.cookieConsentText}</p>
                </div>
                <button
                    onClick={handleAccept}
                    className="flex-shrink-0 bg-brand-gold text-brand-blue font-bold py-2 px-6 rounded-full hover:bg-yellow-400 transition-colors duration-300 transform hover:scale-105"
                >
                    {t.cookieAccept}
                </button>
            </div>
        </div>
    );
};

export default CookieConsent;