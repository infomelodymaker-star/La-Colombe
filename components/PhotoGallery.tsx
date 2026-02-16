import React, { useState, useEffect } from 'react';
import LazyImage from './LazyImage';
import { useLanguage } from '../contexts/LanguageContext';

interface PhotoGalleryProps {
  navigateTo: (page: string) => void;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ navigateTo }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const { t, galleryImages } = useLanguage();
  
  const galleryImagesToShow = galleryImages.slice(0, 6);

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const showNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prevIndex) => (prevIndex! + 1) % galleryImagesToShow.length);
    }
  };

  const showPrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prevIndex) => (prevIndex! - 1 + galleryImagesToShow.length) % galleryImagesToShow.length);
    }
  };
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'Escape') {
        closeLightbox();
      }
      if (e.key === 'ArrowRight') {
        showNextImage();
      }
      if (e.key === 'ArrowLeft') {
        showPrevImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImageIndex, galleryImagesToShow.length]);


  return (
    <section id="gallery" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-brand-blue dark:text-white">{t.galleryTitle}</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{t.gallerySubtitle}</p>
        </div>
        <div className="columns-2 md:columns-3 gap-4">
          {galleryImagesToShow.map((image, index) => (
            <div key={index} className="overflow-hidden rounded-lg shadow-lg group mb-4 break-inside-avoid cursor-pointer" onClick={() => openLightbox(index)}>
              <LazyImage
                src={image.src}
                alt={image.alt}
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
            <button 
              onClick={() => navigateTo('gallery')}
              className="bg-brand-blue text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
            >
              {t.viewFullGallery}
            </button>
        </div>
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
              src={galleryImagesToShow[selectedImageIndex].src} 
              alt={galleryImagesToShow[selectedImageIndex].alt}
              className="block object-contain max-w-full max-h-full rounded-lg shadow-2xl"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-center text-white text-lg pointer-events-none">
              {galleryImagesToShow[selectedImageIndex].alt}
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in {
            animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default PhotoGallery;