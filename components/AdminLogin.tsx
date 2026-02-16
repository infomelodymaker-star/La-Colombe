import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import AnimatedSection from './AnimatedSection';

interface AdminLoginProps {
    onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
    const { t } = useLanguage();
    const [mode, setMode] = useState<'login' | 'setup' | 'loading'>('loading');
    
    // State for login mode
    const [password, setPassword] = useState('');

    // State for setup mode
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [error, setError] = useState('');

    useEffect(() => {
        try {
            const storedPassword = localStorage.getItem('admin_password');
            if (storedPassword) {
                setMode('login');
            } else {
                setMode('setup');
            }
        } catch (e) {
            console.error("Could not access localStorage", e);
            // Fallback for environments where localStorage is blocked
            setMode('login'); 
        }
    }, []);


    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const storedPassword = localStorage.getItem('admin_password');
        
        if (password === storedPassword) {
            setError('');
            onLoginSuccess();
        } else {
            setError(t.loginError);
        }
    };

    const handleSetupSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError(t.passwordsDoNotMatch);
            return;
        }
        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }
        
        localStorage.setItem('admin_password', newPassword);
        setError('');
        onLoginSuccess();
    };
    
    const renderContent = () => {
        if (mode === 'loading') {
            return null; // Or a loading spinner
        }

        if (mode === 'setup') {
            return (
                <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center">
                    <h1 className="text-3xl font-serif font-bold text-brand-blue dark:text-white mb-2">{t.createAdminPasswordTitle}</h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-8">{t.createAdminPasswordSubtitle}</p>
                    
                    <form onSubmit={handleSetupSubmit}>
                        <div className="mb-4">
                            <label htmlFor="newPassword" className="sr-only">{t.newPassword}</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder={t.newPassword}
                                className="w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 border-gray-300 focus:ring-brand-blue/50 dark:focus:ring-brand-gold/50"
                                required
                            />
                        </div>
                         <div className="mb-4">
                            <label htmlFor="confirmPassword" className="sr-only">{t.confirmPassword}</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder={t.confirmPassword}
                                className="w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 border-gray-300 focus:ring-brand-blue/50 dark:focus:ring-brand-gold/50"
                                required
                                aria-describedby="password-error"
                            />
                        </div>
                        {error && <p id="password-error" className="text-red-500 text-sm mb-4">{error}</p>}
                        <button
                            type="submit"
                            className="w-full bg-brand-blue text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
                        >
                            {t.savePassword}
                        </button>
                    </form>
                </div>
            );
        }

        return (
            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center">
                <h1 className="text-3xl font-serif font-bold text-brand-blue dark:text-white mb-2">{t.adminLoginTitle}</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-8">{t.adminLoginSubtitle}</p>
                
                <form onSubmit={handleLoginSubmit}>
                    <div className="mb-4">
                        <label htmlFor="password" className="sr-only">{t.password}</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t.password}
                            className="w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 border-gray-300 focus:ring-brand-blue/50 dark:focus:ring-brand-gold/50"
                            required
                            aria-describedby="password-error"
                        />
                    </div>
                    {error && <p id="password-error" className="text-red-500 text-sm mb-4">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-brand-blue text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
                    >
                        {t.login}
                    </button>
                </form>
            </div>
        );
    }

    return (
        <section className="bg-brand-light dark:bg-brand-dark py-20 min-h-[calc(100vh-200px)] flex items-center justify-center">
            <div className="container mx-auto px-6">
                <AnimatedSection>
                    {renderContent()}
                </AnimatedSection>
            </div>
        </section>
    );
};

export default AdminLogin;