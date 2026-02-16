import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import Academics from './components/Academics';
import Testimonials from './components/Testimonials';
import PhotoGallery from './components/PhotoGallery';
import Admissions from './components/Admissions';
import Footer from './components/Footer';
import AnimatedSection from './components/AnimatedSection';
import GalleryPage from './components/GalleryPage';
import AboutPage from './components/AboutPage';
import AdmissionsPage from './components/AdmissionsPage';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ApplicationPage from './components/ApplicationPage';
import ContactPage from './components/ContactPage';
import AcademicsPage from './components/AcademicsPage';
import CalendarPage from './components/CalendarPage';
import CoursesPage from './components/CoursesPage';
import ScrollToTopButton from './components/ScrollToTopButton';
import CookieConsent from './components/CookieConsent';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import QuoteSection from './components/QuoteSection';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const navigateTo = (page: string, anchor?: string) => {
    // If we are navigating to a different page.
    if (currentPage !== page) {
        setCurrentPage(page);
        // After setting the page, we need to wait for the render cycle.
        setTimeout(() => {
            if (anchor) {
                document.querySelector(anchor)?.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.scrollTo(0, 0);
            }
        }, 100); // A small delay to let the page component render
    } else {
        // We are already on the correct page.
        if (anchor) {
            document.querySelector(anchor)?.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Navigating to the same page without an anchor, scroll to top for consistency.
            window.scrollTo(0, 0);
        }
    }
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
  };
  
  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    navigateTo('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero navigateTo={navigateTo} />
            <AnimatedSection>
              <AboutUs navigateTo={navigateTo} />
            </AnimatedSection>
            <AnimatedSection>
              <Academics />
            </AnimatedSection>
            <AnimatedSection>
              <QuoteSection />
            </AnimatedSection>
            <AnimatedSection>
              <Testimonials />
            </AnimatedSection>
            <AnimatedSection>
              <PhotoGallery navigateTo={navigateTo} />
            </AnimatedSection>
            <AnimatedSection>
              <Admissions navigateTo={navigateTo} />
            </AnimatedSection>
          </>
        );
      case 'gallery': return <GalleryPage />;
      case 'about_page': return <AboutPage />;
      case 'academics_page': return <AcademicsPage navigateTo={navigateTo} />;
      case 'admissions_page': return <AdmissionsPage navigateTo={navigateTo} />;
      case 'application': return <ApplicationPage navigateTo={navigateTo} />;
      case 'contact_page': return <ContactPage />;
      case 'calendar_page': return <CalendarPage />;
      case 'courses_page': return <CoursesPage />;
      case 'admin_dashboard':
        return isAdminLoggedIn ? 
          <AdminDashboard onLogout={handleAdminLogout} /> : 
          <AdminLogin onLoginSuccess={handleAdminLogin} />;
      default: return null;
    }
  };


  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="bg-brand-light text-brand-dark dark:bg-brand-dark dark:text-brand-light font-sans">
          <Header navigateTo={navigateTo} />
          <main>
            {renderPage()}
          </main>
          <CookieConsent />
          <Footer navigateTo={navigateTo} />
          <ScrollToTopButton />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;