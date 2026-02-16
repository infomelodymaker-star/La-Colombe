import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { translations } from '../lib/translations';

type Language = 'en' | 'fr';

// Define a more flexible type for the translations object
type Translations = { [key: string]: any };

export interface GalleryImage {
  src: string;
  alt: string;
  category: string;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translations;
  updateContent: (key: string, value: string) => void;
  galleryImages: GalleryImage[];
  updateGalleryImages: (images: GalleryImage[]) => void;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('fr');
  const [content, setContent] = useState<Translations>({});
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Determine initial language
    let initialLanguage: Language = 'fr';
    if (typeof window !== 'undefined' && localStorage.getItem('cookie_consent') === 'true') {
      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage === 'en' || savedLanguage === 'fr') {
        initialLanguage = savedLanguage as Language;
      }
    }
    setLanguageState(initialLanguage);

    // Load content from localStorage for both languages
    try {
      const customContentEN = JSON.parse(localStorage.getItem('website_content_en') || '{}');
      const customContentFR = JSON.parse(localStorage.getItem('website_content_fr') || '{}');
      
      const mergedContent = {
        en: { ...translations.en, ...customContentEN },
        fr: { ...translations.fr, ...customContentFR },
      };
      setContent(mergedContent);

      const customGallery = JSON.parse(localStorage.getItem('gallery_images') || 'null');
      if (customGallery && Array.isArray(customGallery)) {
          setGalleryImages(customGallery);
      } else {
          setGalleryImages(translations.en.galleryImagesDefault);
      }

    } catch (error) {
      console.error("Failed to load or parse custom content from localStorage", error);
      setContent(translations);
      setGalleryImages(translations.en.galleryImagesDefault);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined' && localStorage.getItem('cookie_consent') === 'true') {
      localStorage.setItem('language', lang);
    }
  };

  const updateContent = useCallback((key: string, value: string) => {
    setContent(prevContent => {
        const newContentForLang = { ...prevContent[language], [key]: value };
        const newFullContent = { ...prevContent, [language]: newContentForLang };

        try {
            const storageKey = `website_content_${language}`;
            const currentStorage = JSON.parse(localStorage.getItem(storageKey) || '{}');
            currentStorage[key] = value;
            localStorage.setItem(storageKey, JSON.stringify(currentStorage));
        } catch (error) {
            console.error("Failed to save content to localStorage", error);
        }

        return newFullContent;
    });
  }, [language]);

  const updateGalleryImages = useCallback((images: GalleryImage[]) => {
    setGalleryImages(images);
    try {
        localStorage.setItem('gallery_images', JSON.stringify(images));
    } catch (error) {
        console.error("Failed to save gallery to localStorage", error);
    }
  }, []);
  
  const t = content[language] || translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, updateContent, isLoading, galleryImages, updateGalleryImages }}>
      {isLoading ? null : children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
