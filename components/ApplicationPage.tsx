import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { CheckIcon } from './icons/CheckIcon';
import { UploadIcon } from './icons/UploadIcon';

// Reusable Input Field Component
interface InputFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    error?: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    children?: React.ReactNode;
    as?: 'input' | 'select' | 'textarea';
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, error, type = 'text', placeholder, required = true, children, as = 'input' }) => {
    const commonProps = {
        name,
        id: name,
        value,
        onChange,
        placeholder,
        required,
        className: `w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${error ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-brand-blue/50 dark:focus:ring-brand-gold/50'}`
    };

    return (
        <div className="mb-6">
            <label htmlFor={name} className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">{label} {required && <span className="text-red-500">*</span>}</label>
            {as === 'input' && <input type={type} {...commonProps} />}
            {as === 'select' && <select {...commonProps}>{children}</select>}
            {as === 'textarea' && <textarea {...commonProps} rows={5}></textarea>}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

// Reusable File Input Component
const FileInput: React.FC<{ label: string; name: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; error?: string; helpText: string; fileName?: string }> = ({ label, name, onChange, error, helpText, fileName }) => (
    <div className="mb-6">
        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">{label} <span className="text-red-500">*</span></label>
        <label htmlFor={name} className={`w-full flex items-center justify-center px-4 py-6 bg-white border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 dark:bg-gray-700 ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 hover:border-brand-blue dark:hover:border-brand-gold'}`}>
            <div className="text-center">
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300"><span className="font-semibold text-brand-blue dark:text-brand-gold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{helpText}</p>
                {fileName && <p className="text-sm text-green-600 mt-2 font-semibold">{fileName}</p>}
            </div>
        </label>
        <input type="file" id={name} name={name} className="hidden" onChange={onChange} accept=".pdf,.doc,.docx" />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
);

// Progress Bar Component
const ProgressBar: React.FC<{ currentStep: number; steps: string[] }> = ({ currentStep, steps }) => (
    <div className="w-full max-w-4xl mx-auto mb-12">
        <div className="flex items-center justify-between">
            {steps.map((step, index) => {
                const stepIndex = index + 1;
                const isActive = stepIndex === currentStep;
                const isCompleted = stepIndex < currentStep;
                return (
                    <React.Fragment key={index}>
                        <div className="flex flex-col items-center text-center w-24">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-4 ${isCompleted ? 'bg-brand-gold border-brand-gold text-white' : isActive ? 'bg-white border-brand-blue text-brand-blue dark:bg-gray-700 dark:border-brand-gold dark:text-brand-gold' : 'bg-gray-200 border-gray-300 text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400'}`}>
                                {isCompleted ? <CheckIcon className="w-6 h-6" /> : <span className="font-bold text-lg">{stepIndex}</span>}
                            </div>
                            <p className={`mt-2 font-semibold text-sm transition-colors duration-300 ${isCompleted || isActive ? 'text-brand-blue dark:text-brand-light' : 'text-gray-500 dark:text-gray-400'}`}>{step}</p>
                        </div>
                        {stepIndex < steps.length && (
                            <div className={`flex-1 h-1 transition-colors duration-300 mx-4 ${isCompleted ? 'bg-brand-gold' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    </div>
);

// Review Field Component
const ReviewField: React.FC<{ label: string, value?: string }> = ({ label, value }) => (
    <div>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-lg text-brand-dark dark:text-white break-words">{value || 'N/A'}</p>
    </div>
);


const ApplicationPage: React.FC<{ navigateTo: (page: string) => void }> = ({ navigateTo }) => {
    const { t } = useLanguage();
    const [currentStep, setCurrentStep] = useState(1);
    
    const [formData, setFormData] = useState<any>(() => {
        const testData = {
            firstName: 'John',
            lastName: 'Doe',
            middleName: 'M',
            dob: '2008-05-15',
            gender: 'male',
            email: 'john.doe@example.com',
            phone: '123-456-7890',
            guardian1Name: 'Jane Doe',
            guardian1Relationship: 'Mother',
            guardian1Email: 'jane.doe@example.com',
            guardian1Phone: '098-765-4321',
            address: '123 Main St, Anytown, USA',
            prevSchool: 'Anytown Middle School',
            prevSchoolCity: 'Anytown, USA',
            currentGrade: '9',
            essay: 'I believe that perseverance is the key to success. One time, I was working on a difficult science project that required building a small robot. My initial designs failed repeatedly, and I felt discouraged. Instead of giving up, I spent hours researching, asking my teacher for advice, and trying new approaches. After many failed attempts, I finally built a robot that could perform the required task. This experience taught me that overcoming challenges is not just about the final result, but about the learning and growth that happens along the way. I am eager to bring this determination to La Colombe High School.',
            transcript: null,
        };

        const consent = typeof window !== 'undefined' && localStorage.getItem('cookie_consent') === 'true';
        if (consent) {
            const savedDataJSON = localStorage.getItem('admission_form_data');
            if (savedDataJSON) {
                try {
                    const savedData = JSON.parse(savedDataJSON);
                    // Reset file input fields on load for security and simplicity
                    savedData.transcript = null;
                    return savedData;
                } catch (e) {
                    console.error("Failed to parse admission form data from localStorage", e);
                    return testData;
                }
            }
        }
        return testData;
    });

    const [errors, setErrors] = useState<any>({});
    const [showGuardian2, setShowGuardian2] = useState(!!formData.guardian2Name);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const steps = [t.step1, t.step2, t.step3, t.step4];

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent') === 'true';
        if (consent && !isSubmitted) {
            const dataToSave = { ...formData };
            delete dataToSave.transcript; // Never save the File object
            localStorage.setItem('admission_form_data', JSON.stringify(dataToSave));
        }
    }, [formData, isSubmitted]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            // We store the file object in state, but it won't be persisted in localStorage
            setFormData({ ...formData, transcript: file });
             if (errors.transcript) {
                setErrors({ ...errors, transcript: '' });
            }
        }
    };

    const validateStep = () => {
        let newErrors: any = {};
        if (currentStep === 1) {
            if (!formData.firstName) newErrors.firstName = t.requiredField;
            if (!formData.lastName) newErrors.lastName = t.requiredField;
            if (!formData.dob) newErrors.dob = t.requiredField;
            if (!formData.gender) newErrors.gender = t.requiredField;
            if (!formData.email) newErrors.email = t.requiredField;
            else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t.invalidEmail;
            if (!formData.phone) newErrors.phone = t.requiredField;
        }
        if (currentStep === 2) {
            if (!formData.guardian1Name) newErrors.guardian1Name = t.requiredField;
            if (!formData.guardian1Relationship) newErrors.guardian1Relationship = t.requiredField;
            if (!formData.guardian1Email) newErrors.guardian1Email = t.requiredField;
             else if (!/\S+@\S+\.\S+/.test(formData.guardian1Email)) newErrors.guardian1Email = t.invalidEmail;
            if (!formData.guardian1Phone) newErrors.guardian1Phone = t.requiredField;
            if (!formData.address) newErrors.address = t.requiredField;
        }
        if (currentStep === 3) {
            if (!formData.prevSchool) newErrors.prevSchool = t.requiredField;
            if (!formData.prevSchoolCity) newErrors.prevSchoolCity = t.requiredField;
            if (!formData.currentGrade) newErrors.currentGrade = t.requiredField;
            if (!formData.transcript) newErrors.transcript = t.requiredField;
            if (!formData.essay) newErrors.essay = t.requiredField;
        }
        if (currentStep === 4) {
            if (!formData.confirmation) newErrors.confirmation = 'You must confirm the information is accurate.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleNext = () => {
        if (validateStep()) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStep()) {
            setIsSubmitting(true);
            
            // Simulate API call and save to localStorage
            await new Promise(res => setTimeout(res, 2000));
            
            try {
                const existingApplicationsJSON = localStorage.getItem('school_applications');
                const existingApplications = existingApplicationsJSON ? JSON.parse(existingApplicationsJSON) : [];
                
                const newApplication = {
                    ...formData,
                    id: `app_${new Date().getTime()}`,
                    submissionDate: new Date().toISOString(),
                    status: 'Pending',
                    transcript: formData.transcript.name // Only save filename
                };
                
                existingApplications.push(newApplication);
                localStorage.setItem('school_applications', JSON.stringify(existingApplications));
                
                setIsSubmitting(false);
                setIsSubmitted(true);
                localStorage.removeItem('admission_form_data');
                window.scrollTo(0,0);
            } catch (error) {
                console.error("Failed to save application to localStorage", error);
                alert("There was an error submitting your application. Please try again.");
                setIsSubmitting(false);
            }
        }
    };

    if (isSubmitted) {
        return (
            <div className="container mx-auto px-6 py-20 text-center">
                 <div className="w-24 h-24 mx-auto bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                    <CheckIcon className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-4xl font-serif font-bold text-brand-blue dark:text-white mt-8">{t.submissionSuccessTitle}</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">{t.submissionSuccessText}</p>
                <button onClick={() => navigateTo('home')} className="mt-8 bg-brand-blue text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105">
                    {t.backToHome}
                </button>
            </div>
        );
    }

    return (
        <section className="py-20 bg-brand-light dark:bg-brand-dark">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-serif font-bold text-brand-blue dark:text-white">{t.applicationFormTitle}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">{t.applicationFormSubtitle}</p>
                </div>

                <ProgressBar currentStep={currentStep} steps={steps} />
                
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-xl" noValidate>
                    {currentStep === 1 && (
                        <div className="grid md:grid-cols-2 gap-x-8">
                            <InputField label={t.firstName} name="firstName" value={formData.firstName || ''} onChange={handleChange} error={errors.firstName} />
                            <InputField label={t.lastName} name="lastName" value={formData.lastName || ''} onChange={handleChange} error={errors.lastName} />
                            <InputField label={t.middleName} name="middleName" value={formData.middleName || ''} onChange={handleChange} required={false} />
                            <InputField label={t.dob} name="dob" type="date" value={formData.dob || ''} onChange={handleChange} error={errors.dob} />
                            <InputField label={t.gender} name="gender" as="select" value={formData.gender || ''} onChange={handleChange} error={errors.gender}>
                                <option value="">{t.selectGender}</option>
                                <option value="male">{t.male}</option>
                                <option value="female">{t.female}</option>
                                <option value="other">{t.other}</option>
                            </InputField>
                             <InputField label={t.emailAddress} name="email" type="email" value={formData.email || ''} onChange={handleChange} error={errors.email} />
                            <InputField label={t.phoneNumber} name="phone" type="tel" value={formData.phone || ''} onChange={handleChange} error={errors.phone} />
                        </div>
                    )}

                    {currentStep === 2 && (
                         <div>
                            <InputField label={t.guardian1Name} name="guardian1Name" value={formData.guardian1Name || ''} onChange={handleChange} error={errors.guardian1Name} />
                            <div className="grid md:grid-cols-2 gap-x-8">
                                <InputField label={t.guardian1Relationship} name="guardian1Relationship" value={formData.guardian1Relationship || ''} onChange={handleChange} error={errors.guardian1Relationship} />
                                <InputField label={t.guardian1Phone} name="guardian1Phone" type="tel" value={formData.guardian1Phone || ''} onChange={handleChange} error={errors.guardian1Phone} />
                            </div>
                            <InputField label={t.guardian1Email} name="guardian1Email" type="email" value={formData.guardian1Email || ''} onChange={handleChange} error={errors.guardian1Email} />
                            <InputField label={t.address} name="address" as="textarea" value={formData.address || ''} onChange={handleChange} error={errors.address} />

                            {!showGuardian2 && <button type="button" onClick={() => setShowGuardian2(true)} className="text-brand-blue dark:text-brand-gold font-semibold hover:underline">{t.addGuardian}</button>}
                            
                            {showGuardian2 && (
                                <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
                                    <InputField label={t.guardian2Name} name="guardian2Name" value={formData.guardian2Name || ''} onChange={handleChange} required={false} />
                                     <div className="grid md:grid-cols-2 gap-x-8">
                                        <InputField label={t.guardian2Relationship} name="guardian2Relationship" value={formData.guardian2Relationship || ''} onChange={handleChange} required={false} />
                                        <InputField label={t.guardian2Phone} name="guardian2Phone" type="tel" value={formData.guardian2Phone || ''} onChange={handleChange} required={false} />
                                    </div>
                                    <InputField label={t.guardian2Email} name="guardian2Email" type="email" value={formData.guardian2Email || ''} onChange={handleChange} required={false} />
                                    <button type="button" onClick={() => setShowGuardian2(false)} className="text-red-600 font-semibold hover:underline">{t.removeGuardian}</button>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {currentStep === 3 && (
                        <div>
                             <div className="grid md:grid-cols-2 gap-x-8">
                                <InputField label={t.prevSchool} name="prevSchool" value={formData.prevSchool || ''} onChange={handleChange} error={errors.prevSchool} />
                                <InputField label={t.prevSchoolCity} name="prevSchoolCity" value={formData.prevSchoolCity || ''} onChange={handleChange} error={errors.prevSchoolCity} />
                             </div>
                             <InputField label={t.currentGrade} name="currentGrade" type="number" value={formData.currentGrade || ''} onChange={handleChange} error={errors.currentGrade} />
                             <FileInput label={t.transcript} name="transcript" onChange={handleFileChange} error={errors.transcript} helpText={t.transcriptHelp} fileName={formData.transcript?.name} />
                             <InputField label={t.essay} name="essay" as="textarea" value={formData.essay || ''} onChange={handleChange} error={errors.essay} placeholder={t.essayPrompt} />
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div>
                            <h3 className="text-2xl font-bold text-brand-blue dark:text-white mb-4">{t.reviewInfo}</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-8">{t.reviewSubtitle}</p>
                            
                            <div className="space-y-8 bg-brand-light/50 dark:bg-gray-700/50 p-6 rounded-lg">
                                <div>
                                    <h4 className="text-xl font-semibold text-brand-blue dark:text-brand-gold border-b-2 border-brand-gold pb-2 mb-4">{t.studentInfo}</h4>
                                    <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                                        <ReviewField label={t.firstName} value={formData.firstName} />
                                        <ReviewField label={t.lastName} value={formData.lastName} />
                                        <ReviewField label={t.middleName} value={formData.middleName} />
                                        <ReviewField label={t.dob} value={formData.dob} />
                                        <ReviewField label={t.gender} value={formData.gender} />
                                        <ReviewField label={t.emailAddress} value={formData.email} />
                                        <ReviewField label={t.phoneNumber} value={formData.phone} />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold text-brand-blue dark:text-brand-gold border-b-2 border-brand-gold pb-2 mb-4">{t.guardianInfo}</h4>
                                    <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                                        <ReviewField label={t.guardian1Name} value={formData.guardian1Name} />
                                        <ReviewField label={t.guardian1Relationship} value={formData.guardian1Relationship} />
                                        <ReviewField label={t.guardian1Email} value={formData.guardian1Email} />
                                        <ReviewField label={t.guardian1Phone} value={formData.guardian1Phone} />
                                        <ReviewField label={t.address} value={formData.address} />
                                        {showGuardian2 && (
                                            <>
                                                <ReviewField label={t.guardian2Name} value={formData.guardian2Name} />
                                                <ReviewField label={t.guardian2Relationship} value={formData.guardian2Relationship} />
                                                <ReviewField label={t.guardian2Email} value={formData.guardian2Email} />
                                                <ReviewField label={t.guardian2Phone} value={formData.guardian2Phone} />
                                            </>
                                        )}
                                    </div>
                                </div>
                                 <div>
                                    <h4 className="text-xl font-semibold text-brand-blue dark:text-brand-gold border-b-2 border-brand-gold pb-2 mb-4">{t.academicHistory}</h4>
                                    <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                                        <ReviewField label={t.prevSchool} value={formData.prevSchool} />
                                        <ReviewField label={t.prevSchoolCity} value={formData.prevSchoolCity} />
                                        <ReviewField label={t.currentGrade} value={formData.currentGrade} />
                                        <ReviewField label={t.transcript} value={formData.transcript?.name} />
                                    </div>
                                    <div className="mt-4">
                                        <ReviewField label={t.essay} value={formData.essay} />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8">
                                <label className="flex items-start">
                                    <input type="checkbox" name="confirmation" checked={formData.confirmation || false} onChange={e => setFormData({...formData, confirmation: e.target.checked})} className="mt-1 h-5 w-5 text-brand-blue focus:ring-brand-blue border-gray-300 rounded" />
                                    <span className="ml-3 text-gray-700 dark:text-gray-300">{t.confirmation}</span>
                                </label>
                                {errors.confirmation && <p className="text-red-500 text-sm mt-2">{errors.confirmation}</p>}
                            </div>
                        </div>
                    )}
                    
                    <div className="mt-12 flex justify-between items-center">
                        <button type="button" onClick={handlePrev} disabled={currentStep === 1} className="bg-gray-200 text-gray-700 font-bold py-3 px-8 rounded-full hover:bg-gray-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                            {t.prevStep}
                        </button>
                        
                        {currentStep < steps.length ? (
                             <button type="button" onClick={handleNext} className="bg-brand-blue text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105">
                                {t.nextStep}
                            </button>
                        ) : (
                            <button type="submit" disabled={isSubmitting || !formData.confirmation} className="bg-brand-gold text-brand-blue font-bold py-3 px-8 rounded-full hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-wait">
                                {isSubmitting ? t.submitting : t.submitApplication}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </section>
    );
};

export default ApplicationPage;