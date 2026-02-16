import React from 'react';
import { FacebookIcon, TwitterIcon, InstagramIcon } from './icons/SocialIcons';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterProps {
  navigateTo: (page: string, anchor?: string) => void;
}

const Footer: React.FC<FooterProps> = ({ navigateTo }) => {
  const { t } = useLanguage();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, anchor: string) => {
    e.preventDefault();
    const targetElement = document.querySelector(anchor);
    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <footer id="contact" className="bg-brand-blue text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-2xl font-serif font-bold mb-4">
              La <span className="text-brand-gold">COLOMBE</span>
            </h3>
            <p className="text-gray-400">
              {t.schoolMottoShort}
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-brand-gold tracking-wider">{t.quickLinks}</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigateTo('about_page')} className="hover:text-brand-gold transition-colors">{t.about}</button></li>
              <li><button onClick={() => navigateTo('academics_page')} className="hover:text-brand-gold transition-colors">{t.academics}</button></li>
              <li><button onClick={() => navigateTo('admissions_page')} className="hover:text-brand-gold transition-colors">{t.admissions}</button></li>
               <li><button onClick={() => navigateTo('contact_page', '#careers')} className="hover:text-brand-gold transition-colors">{t.careers}</button></li>
            </ul>
          </div>
           <div>
            <h4 className="text-lg font-semibold mb-4 text-brand-gold tracking-wider">{t.contactUs}</h4>
            <p className="text-gray-400 mb-2">123 Education Lane, Knowledge City, 12345</p>
            <p className="text-gray-400 mb-2">{t.email}: <a href="mailto:info@lacolombe.edu" className="hover:text-brand-gold">info@lacolombe.edu</a></p>
            <p className="text-gray-400">{t.phone}: <a href="tel:+1234567890" className="hover:text-brand-gold">(123) 456-7890</a></p>
          </div>
          <div>
             <h4 className="text-lg font-semibold mb-4 text-brand-gold tracking-wider">Follow Us</h4>
             <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-brand-gold transition-colors" aria-label="Facebook"><FacebookIcon /></a>
              <a href="#" className="text-gray-400 hover:text-brand-gold transition-colors" aria-label="Twitter"><TwitterIcon /></a>
              <a href="#" className="text-gray-400 hover:text-brand-gold transition-colors" aria-label="Instagram"><InstagramIcon /></a>
            </div>
          </div>
        </div>
        <div className="text-center text-gray-500 border-t border-gray-700 mt-12 pt-6">
          <p>&copy; {new Date().getFullYear()} {t.copyright}</p>
          <button onClick={() => navigateTo('admin_dashboard')} className="text-sm text-gray-600 hover:text-brand-gold transition-colors mt-2">
            {t.adminLogin}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;