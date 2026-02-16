import React, { useState } from 'react';
import AnimatedSection from './AnimatedSection';
import { useLanguage } from '../contexts/LanguageContext';
import { LocationPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from './icons/ContactIcons';
import { CheckIcon } from './icons/CheckIcon';

// Reusable Input Field Component
const InputField: React.FC<{
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    error?: string;
    type?: string;
    as?: 'input' | 'textarea' | 'select';
    children?: React.ReactNode;
}> = ({ label, name, value, onChange, error, type = 'text', as = 'input', children }) => (
    <div>
        <label htmlFor={name} className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">{label} <span className="text-red-500">*</span></label>
        {as === 'input' && (
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${error ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 dark:border-gray-600 focus:ring-brand-blue/50 dark:focus:ring-brand-gold/50'}`}
            />
        )}
        {as === 'textarea' && (
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                rows={5}
                className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${error ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 dark:border-gray-600 focus:ring-brand-blue/50 dark:focus:ring-brand-gold/50'}`}
            />
        )}
        {as === 'select' && (
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${error ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 dark:border-gray-600 focus:ring-brand-blue/50 dark:focus:ring-brand-gold/50'}`}
            >
                {children}
            </select>
        )}
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
);

// Reusable Contact Info Card
const InfoCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; }> = ({ icon, title, children }) => (
    <div className="flex items-start">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-brand-gold/10 text-brand-blue dark:text-brand-gold rounded-lg">
            {icon}
        </div>
        <div className="ml-4">
            <h3 className="text-lg font-bold text-brand-blue dark:text-white">{title}</h3>
            <div className="text-gray-600 dark:text-gray-300">{children}</div>
        </div>
    </div>
);


const ContactPage: React.FC = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({ name: '', email: '', inquiryType: '', subject: '', message: '' });
    const [errors, setErrors] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validate = () => {
        let newErrors: any = {};
        if (!formData.name) newErrors.name = t.requiredField;
        if (!formData.email) newErrors.email = t.requiredField;
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t.invalidEmail;
        if (!formData.inquiryType) newErrors.inquiryType = t.requiredField;
        if (!formData.subject) newErrors.subject = t.requiredField;
        if (!formData.message) newErrors.message = t.requiredField;
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            setIsSubmitting(true);
            await new Promise(res => setTimeout(res, 1500)); // Simulate API call
            setIsSubmitting(false);
            setIsSubmitted(true);
        }
    };

    return (
        <div>
            {/* Hero Section */}
            <section className="relative h-[50vh] flex items-center justify-center text-center text-white bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/seed/contact-hero/1920/1080')" }}>
                <div className="absolute inset-0 bg-brand-blue opacity-70"></div>
                <div className="relative z-10 px-4">
                    <AnimatedSection>
                        <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight tracking-wide">{t.contactPageTitle}</h1>
                        <p className="text-lg md:text-xl max-w-3xl mx-auto mt-4 font-light">{t.contactPageSubtitle}</p>
                    </AnimatedSection>
                </div>
            </section>

            {/* Contact Info and Form Section */}
            <AnimatedSection>
                <section className="py-20 bg-white dark:bg-gray-900">
                    <div className="container mx-auto px-6">
                        <div className="grid lg:grid-cols-5 gap-12">
                            {/* Left Side: Contact Info */}
                            <div className="lg:col-span-2">
                                <h2 className="text-3xl font-serif font-bold text-brand-blue dark:text-white mb-6">{t.getInTouch}</h2>
                                <div className="space-y-6">
                                    <InfoCard icon={<LocationPinIcon />} title={t.ourAddress}>
                                        <p>123 Education Lane, Knowledge City, 12345</p>
                                    </InfoCard>
                                    <InfoCard icon={<PhoneIcon />} title={t.callUs}>
                                        <a href="tel:+1234567890" className="hover:text-brand-gold transition-colors">(123) 456-7890</a>
                                    </InfoCard>
                                    <InfoCard icon={<EnvelopeIcon />} title={t.emailUs}>
                                        <a href="mailto:info@lacolombe.edu" className="hover:text-brand-gold transition-colors">info@lacolombe.edu</a>
                                    </InfoCard>
                                     <InfoCard icon={<ClockIcon />} title={t.officeHours}>
                                        <p>{t.hoursText}</p>
                                    </InfoCard>
                                </div>
                                <div className="mt-8 rounded-lg overflow-hidden shadow-lg">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.219528281084!2d-73.98824268459393!3d40.757974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6434223%3A0x876a45c6b45f32a!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1614285555555!5m2!1sen!2sus"
                                        width="100%"
                                        height="250"
                                        style={{ border: 0 }}
                                        allowFullScreen={false}
                                        loading="lazy"
                                        title="School Location Map"
                                        className="dark:grayscale dark:invert"
                                    ></iframe>
                                </div>
                            </div>

                            {/* Right Side: Form */}
                            <div className="lg:col-span-3 bg-brand-light dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                                 {isSubmitted ? (
                                    <div className="text-center flex flex-col items-center justify-center h-full">
                                        <div className="w-24 h-24 mb-6 bg-green-100 rounded-full flex items-center justify-center">
                                            <CheckIcon className="w-12 h-12 text-green-600" />
                                        </div>
                                        <h2 className="text-3xl font-serif font-bold text-brand-blue dark:text-white">{t.contactSuccessTitle}</h2>
                                        <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-md mx-auto">{t.contactSuccessText}</p>
                                        <button
                                            onClick={() => {
                                                setIsSubmitted(false);
                                                setFormData({ name: '', email: '', inquiryType: '', subject: '', message: '' });
                                            }}
                                            className="mt-6 bg-brand-blue text-white font-bold py-3 px-6 rounded-full hover:bg-opacity-90 transition-all duration-300"
                                        >
                                            {t.backToContact}
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-3xl font-serif font-bold text-brand-blue dark:text-white mb-2">{t.contactFormTitle}</h2>
                                        <p className="text-gray-600 dark:text-gray-300 mb-8">{t.contactFormSubtitle}</p>
                                        <form onSubmit={handleSubmit} noValidate className="space-y-6">
                                            <InputField label={t.fullName} name="name" value={formData.name} onChange={handleChange} error={errors.name} />
                                            <InputField label={t.emailAddress} name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
                                            <InputField as="select" label={t.inquiryType} name="inquiryType" value={formData.inquiryType} onChange={handleChange} error={errors.inquiryType}>
                                                <option value="">{t.selectInquiry}</option>
                                                <option value="general">{t.inquiryGeneral}</option>
                                                <option value="admissions">{t.inquiryAdmissions}</option>
                                                <option value="support">{t.inquirySupport}</option>
                                                <option value="careers">{t.inquiryCareers}</option>
                                            </InputField>
                                            <InputField label={t.subject} name="subject" value={formData.subject} onChange={handleChange} error={errors.subject} />
                                            <InputField label={t.message} name="message" as="textarea" value={formData.message} onChange={handleChange} error={errors.message} />
                                            <div>
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="w-full bg-brand-gold text-brand-blue font-bold py-3 px-8 rounded-full hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-wait"
                                                >
                                                    {isSubmitting ? t.sending : t.sendMessage}
                                                </button>
                                            </div>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </AnimatedSection>
        </div>
    );
};

export default ContactPage;