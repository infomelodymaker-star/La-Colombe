import React from 'react';
import LazyImage from './LazyImage';
import { useLanguage } from '../contexts/LanguageContext';

interface TestimonialCardProps {
  imageSrc: string;
  quote: string;
  name: string;
  role: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ imageSrc, quote, name, role }) => (
  <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center flex flex-col items-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
    <LazyImage src={imageSrc} alt={name} className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-brand-gold object-cover" />
    <blockquote className="text-gray-600 dark:text-gray-300 italic mb-6 flex-grow">
      "{quote}"
    </blockquote>
    <div>
      <p className="font-bold text-brand-blue dark:text-white text-lg">{name}</p>
      <p className="text-gray-500 dark:text-gray-400 text-sm">{role}</p>
    </div>
  </div>
);


const Testimonials: React.FC = () => {
  const { t } = useLanguage();

  const testimonials = [
    {
      imageSrc: t.testimonial1Image,
      quote: t.testimonial1Quote,
      name: t.testimonial1Name,
      role: t.testimonial1Role,
    },
    {
      imageSrc: t.testimonial2Image,
      quote: t.testimonial2Quote,
      name: t.testimonial2Name,
      role: t.testimonial2Role,
    },
    {
      imageSrc: t.testimonial3Image,
      quote: t.testimonial3Quote,
      name: t.testimonial3Name,
      role: t.testimonial3Role,
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-brand-light dark:bg-brand-dark">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-brand-blue dark:text-white">{t.testimonialsTitle}</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{t.testimonialsSubtitle}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;