import React, { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  rootMargin?: string;
}

// A 1x1 transparent GIF
const placeholderSrc = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className, rootMargin = '100px 0px' }) => {
  const [imageSrc, setImageSrc] = useState(placeholderSrc);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src); // Trigger re-render with the actual src
          const currentImg = imgRef.current;
          if (currentImg) {
            observer.unobserve(currentImg);
          }
        }
      },
      {
        rootMargin, // Use the configurable rootMargin
      }
    );

    const currentRef = imgRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [src, rootMargin]);

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`${className} transition-opacity duration-500 ease-in-out ${imageSrc === src ? 'opacity-100' : 'opacity-0'}`}
    />
  );
};

export default LazyImage;