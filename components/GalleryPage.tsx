import React, { useState, useEffect, useMemo } from 'react';
import LazyImage from './LazyImage';
import AnimatedSection from './AnimatedSection';
import { useLanguage } from '../contexts/LanguageContext';

const IMAGES_PER_PAGE = 12;

const GalleryPage: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const { t, galleryImages } = useLanguage();
    const [visibleCount, setVisibleCount] = useState(IMAGES_PER_PAGE);

    const categories = useMemo(() => {
        const categoryKeys = ['All', ...Array.from(new Set(galleryImages.map(img => img.category)))];
        const translationMap: { [key: string]: string } = {
            'All': t.filterAll,
            'Academics': t.filterAcademics,
            'Sports': t.filterSports,
            'Events': t.filterEvents,
            'Campus': t.filterCampus,
        };
        // Fallback for custom categories
        return categoryKeys.map(key => ({
            key: key,
            label: translationMap[key] || key
        }));
    }, [galleryImages, t]);

    const filteredImages = useMemo(() => {
        if (activeCategory === 'All') return galleryImages;
        return galleryImages.filter(img => img.category === activeCategory);
    }, [activeCategory, galleryImages]);

    const imagesToShow = useMemo(() => {
        return filteredImages.slice(0, visibleCount);
    }, [filteredImages, visibleCount]);

    useEffect(() => {
        setVisibleCount(IMAGES_PER_PAGE);
    }, [activeCategory]);

    const handleLoadMore = () => {
        setVisibleCount(prevCount => prevCount + IMAGES_PER_PAGE);
    };

    const openLightbox = (index: number) => {
        const globalIndex = galleryImages.findIndex(img => img.src === imagesToShow[index].src);
        setSelectedImageIndex(globalIndex);
    };

    const closeLightbox = () => {
        setSelectedImageIndex(null);
    };

    const showNextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((prevIndex) => (prevIndex! + 1) % galleryImages.length);
        }
    };
    
    const showPrevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((prevIndex) => (prevIndex! - 1 + galleryImages.length) % galleryImages.length);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedImageIndex === null) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImageIndex, galleryImages]);


    useEffect(() => {
        const imagesToPreload = filteredImages.slice(0, 8);
        imagesToPreload.forEach(imageInfo => {
            const img = new Image();
            img.src = imageInfo.src;
        });
    }, [filteredImages]);

    return (
        <AnimatedSection>
            <section id="full-gallery" className="py-20 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-serif font-bold text-brand-blue dark:text-white">{t.galleryPageTitle}</h2>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">{t.galleryPageSubtitle}</p>
                    </div>

                    <div className="flex justify-center flex-wrap gap-3 md:gap-4 mb-12">
                        {categories.map(category => (
                            <button
                                key={category.key}
                                onClick={() => setActiveCategory(category.key)}
                                className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 text-sm md:text-base ${
                                    activeCategory === category.key
                                        ? 'bg-brand-blue text-white shadow-md'
                                        : 'bg-gray-200 text-gray-700 hover:bg-brand-gold hover:text-brand-blue dark:bg-gray-700 dark:text-gray-200 dark:hover:text-brand-blue'
                                }`}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>

                    <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
                        {imagesToShow.map((image, index) => (
                            <div key={image.src + index} className="overflow-hidden rounded-lg shadow-lg group mb-4 break-inside-avoid cursor-pointer" onClick={() => openLightbox(index)}>
                                <LazyImage
                                    src={image.src}
                                    alt={image.alt}
                                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
                                    rootMargin="500px 0px"
                                />
                            </div>
                        ))}
                    </div>

                    {visibleCount < filteredImages.length && (
                        <div className="text-center mt-12">
                            <button
                                onClick={handleLoadMore}
                                className="bg-brand-blue text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
                            >
                                {t.loadMore}
                            </button>
                        </div>
                    )}
                </div>

                {selectedImageIndex !== null && (
                    <div 
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center transition-opacity duration-300 animate-fade-in"
                        onClick={closeLightbox}
                    >
                        <button
                            className="absolute top-6 right-6 bg-black/50 rounded-full w-10 h-10 flex items-center justify-center text-white text-2xl hover:bg-black/80 transition-all z-20"
                            onClick={closeLightbox}
                            aria-label="Close lightbox"
                        >
                            &times;
                        </button>
                        
                        <button
                            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 bg-black/50 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-white text-2xl sm:text-3xl hover:bg-black/80 transition-all z-20"
                            onClick={showPrevImage}
                            aria-label="Previous image"
                        >
                            &#8249;
                        </button>

                        <button
                            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 bg-black/50 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-white text-2xl sm:text-3xl hover:bg-black/80 transition-all z-20"
                            onClick={showNextImage}
                            aria-label="Next image"
                        >
                            &#8250;
                        </button>

                        <div 
                            className="relative w-full h-full flex items-center justify-center p-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img 
                                src={galleryImages[selectedImageIndex].src} 
                                alt={galleryImages[selectedImageIndex].alt}
                                className="block object-contain max-w-full max-h-full rounded-lg shadow-2xl"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-center text-white text-lg pointer-events-none">
                                {galleryImages[selectedImageIndex].alt}
                            </div>
                        </div>
                    </div>
                )}
            </section>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </AnimatedSection>
    );
};

export default GalleryPage;