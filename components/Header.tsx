import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import ThemeToggle from './ThemeToggle';
import { ChevronDownIcon } from './icons/InfoIcons';

const NavLink: React.FC<{ onClick: () => void; children: React.ReactNode; className?: string }> = ({ onClick, children, className }) => (
  <button onClick={onClick} className={`text-white hover:text-brand-gold transition-colors duration-300 ${className}`}>
    {children}
  </button>
);

const Header: React.FC<{ navigateTo: (page: string, anchor?: string) => void }> = ({ navigateTo }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage, t } = useLanguage();

  const handleLinkClick = (page: string, anchor?: string) => {
    navigateTo(page, anchor);
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };
  
  // Effect to close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);


  const navLinks = [
    { page: 'home', anchor: '#home', label: t.home },
    { page: 'about_page', label: t.about },
    { page: 'academics_page', label: t.academics },
    { page: 'gallery', label: t.gallery },
    { page: 'admissions_page', label: t.admissions },
    { page: 'contact_page', label: t.contact },
  ];

  const primaryLinks = navLinks.slice(0, 3);
  const secondaryLinks = navLinks.slice(3);

  return (
    <header className="bg-brand-blue/80 backdrop-blur-lg sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <button onClick={() => handleLinkClick('home', '#home')} className="text-2xl font-serif font-bold text-white text-left">
          La <span className="text-brand-gold">COLOMBE</span>
        </button>

        {/* Desktop & Tablet Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          {primaryLinks.map((link) => (
            <NavLink key={link.page + (link.anchor || '')} onClick={() => handleLinkClick(link.page, link.anchor)} className="py-2">
              {link.label}
            </NavLink>
          ))}
          
          {/* Secondary links for large screens */}
          <div className="hidden lg:flex space-x-6">
            {secondaryLinks.map((link) => (
              <NavLink key={link.page + (link.anchor || '')} onClick={() => handleLinkClick(link.page, link.anchor)} className="py-2">
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* "More" Dropdown for medium screens */}
          <div className="relative hidden md:block lg:hidden" ref={dropdownRef}>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="text-white hover:text-brand-gold transition-colors duration-300 flex items-center py-2">
              More
              <ChevronDownIcon className={`w-5 h-5 ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-brand-blue rounded-md shadow-lg py-1 z-20">
                {secondaryLinks.map((link) => (
                   <button 
                     key={link.page + (link.anchor || '')} 
                     onClick={() => handleLinkClick(link.page, link.anchor)}
                     className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10"
                   >
                     {link.label}
                   </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center ml-4 border-l border-gray-500 pl-4">
            <ThemeToggle />
            <div className="text-white ml-2">
                <button onClick={() => setLanguage('en')} className={`font-semibold transition-colors duration-200 ${language === 'en' ? 'text-brand-gold' : 'text-gray-300 hover:text-white'}`}>EN</button>
                <span className="mx-1 text-gray-500">|</span>
                <button onClick={() => setLanguage('fr')} className={`font-semibold transition-colors duration-200 ${language === 'fr' ? 'text-brand-gold' : 'text-gray-300 hover:text-white'}`}>FR</button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white focus:outline-none" aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-brand-blue pb-4">
          <nav className="flex flex-col items-center space-y-2">
            {navLinks.map((link) => (
              <NavLink key={link.page + (link.anchor || '')} onClick={() => handleLinkClick(link.page, link.anchor)} className="w-full text-center py-2">
                {link.label}
              </NavLink>
            ))}
            <div className="text-white mt-4 pt-4 border-t border-gray-700 w-full flex justify-center items-center space-x-4">
                <ThemeToggle />
                <div>
                    <button onClick={() => { setLanguage('en'); setIsMobileMenuOpen(false); }} className={`font-semibold px-4 py-1 rounded ${language === 'en' ? 'text-brand-gold' : 'hover:text-brand-gold'}`}>EN</button>
                    <span className="text-gray-500">|</span>
                    <button onClick={() => { setLanguage('fr'); setIsMobileMenuOpen(false); }} className={`font-semibold px-4 py-1 rounded ${language === 'fr' ? 'text-brand-gold' : 'hover:text-brand-gold'}`}>FR</button>
                </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;