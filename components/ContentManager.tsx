import React, { useState, useEffect } from 'react';
import { useLanguage, GalleryImage } from '../contexts/LanguageContext';
import { ChevronDownIcon } from './icons/InfoIcons';
import { SaveIcon, ImageIcon, DeleteIcon } from './icons/AdminIcons';

interface ContentManagerProps {
    showToast: (message: string, type?: 'success' | 'error') => void;
}

interface AccordionSectionProps {
    title: string;
    children: React.ReactNode;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg mb-4 overflow-hidden">
            <button
                className="w-full flex justify-between items-center text-left p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="text-lg font-bold text-brand-blue dark:text-white">{title}</h3>
                <ChevronDownIcon className={`w-6 h-6 text-brand-blue dark:text-brand-gold transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[4000px]' : 'max-h-0'}`}>
                <div className="p-4 space-y-6">{children}</div>
            </div>
        </div>
    );
};

interface TextInputProps {
    label: string;
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    isTextarea?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ label, id, value, onChange, isTextarea }) => {
    const commonProps = {
        id,
        name: id,
        value,
        onChange,
        className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    };
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{label}</label>
            {isTextarea ? <textarea {...commonProps} rows={4} /> : <input type="text" {...commonProps} />}
        </div>
    );
}

interface ImageInputProps {
    label: string;
    id: string;
    currentImage: string;
    onImageChange: (file: File) => void;
}

const ImageInput: React.FC<ImageInputProps> = ({ label, id, currentImage, onImageChange }) => {
    const { t } = useLanguage();
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onImageChange(e.target.files[0]);
        }
    };

    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{label}</label>
            <div className="flex items-center gap-4">
                <img src={currentImage} alt="Current" className="w-24 h-24 object-cover rounded-md border dark:border-gray-600" />
                <label htmlFor={id} className="cursor-pointer bg-white dark:bg-gray-700 text-brand-blue dark:text-brand-gold font-semibold py-2 px-4 border border-brand-blue dark:border-brand-gold rounded-lg hover:bg-brand-blue hover:text-white dark:hover:bg-brand-gold dark:hover:text-brand-blue transition-colors">
                    <ImageIcon className="inline w-5 h-5 mr-2" />
                    {t.changeImage}
                </label>
                <input type="file" id={id} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
        </div>
    )
}

const ContentManager: React.FC<ContentManagerProps> = ({ showToast }) => {
    const { t, updateContent, galleryImages, updateGalleryImages } = useLanguage();
    const [formData, setFormData] = useState(t);
    const [isSaving, setIsSaving] = useState(false);

    // Gallery state
    const [localGallery, setLocalGallery] = useState<GalleryImage[]>([]);
    const [newImage, setNewImage] = useState({ src: '', alt: '', category: 'Campus' });
    const [newImageFile, setNewImageFile] = useState<File | null>(null);

    useEffect(() => {
        setFormData(t);
    }, [t]);

    useEffect(() => {
        setLocalGallery(galleryImages);
    }, [galleryImages]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (key: string, file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, [key]: reader.result as string });
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async (keys: string[]) => {
        setIsSaving(true);
        try {
            for (const key of keys) {
                updateContent(key, formData[key]);
            }
            await new Promise(res => setTimeout(res, 500));
            showToast(t.contentSaved);
        } catch (err) {
            showToast(t.errorSaving, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // Gallery functions
    const handleNewImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setNewImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewImage(prev => ({ ...prev, src: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddImage = () => {
        if (!newImage.src || !newImage.alt || !newImage.category) {
            showToast('Image, alt text, and category are required.', 'error');
            return;
        }
        setLocalGallery(prev => [...prev, { src: newImage.src, alt: newImage.alt, category: newImage.category }]);
        setNewImage({ src: '', alt: '', category: 'Campus' });
        setNewImageFile(null);
        const fileInput = document.getElementById('newImageFile') as HTMLInputElement;
        if(fileInput) fileInput.value = '';
    };

    const handleRemoveImage = (index: number) => {
        setLocalGallery(prev => prev.filter((_, i) => i !== index));
    };
    
    const handleSaveGallery = () => {
        updateGalleryImages(localGallery);
        showToast(t.gallerySaved);
    }
    
    const renderSaveButton = (keys: string[]) => (
        <div className="text-right mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <button
                onClick={() => handleSave(keys)}
                disabled={isSaving}
                className="bg-brand-blue text-white font-bold py-2 px-6 rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-wait flex items-center gap-2 ml-auto"
            >
                <SaveIcon />
                {isSaving ? t.saving : t.saveChanges}
            </button>
        </div>
    )

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-brand-dark dark:text-white mb-2">{t.contentManagement}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{t.contentManagementSubtitle}</p>
            
            <AccordionSection title={t.heroSection}>
                <TextInput label={t.tagline} id="heroTitle" value={formData.heroTitle} onChange={handleChange} />
                <TextInput label={t.subtitle} id="heroSubtitle" value={formData.heroSubtitle} onChange={handleChange} isTextarea />
                <ImageInput label={t.backgroundImage} id="heroBackgroundImage" currentImage={formData.heroBackgroundImage} onImageChange={(file) => handleImageChange('heroBackgroundImage', file)} />
                {renderSaveButton(['heroTitle', 'heroSubtitle', 'heroBackgroundImage'])}
            </AccordionSection>

            <AccordionSection title={t.aboutSection}>
                <TextInput label={t.missionStatement} id="missionText" value={formData.missionText} onChange={handleChange} isTextarea />
                <TextInput label={t.visionStatement} id="visionText" value={formData.visionText} onChange={handleChange} isTextarea />
                <ImageInput label={t.sectionImage} id="aboutUsImage" currentImage={formData.aboutUsImage} onImageChange={(file) => handleImageChange('aboutUsImage', file)} />
                {renderSaveButton(['missionText', 'visionText', 'aboutUsImage'])}
            </AccordionSection>
            
            <AccordionSection title={t.homepageAcademicsSection}>
                <TextInput label={t.sectionTitle} id="academicPrograms" value={formData.academicPrograms} onChange={handleChange} />
                <TextInput label={t.subtitle} id="academicSubtitle" value={formData.academicSubtitle} onChange={handleChange} isTextarea />
                <div className="p-4 rounded-md border dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 space-y-4">
                    <h4 className="font-bold text-md mb-2 text-brand-dark dark:text-white">{t.programCard1}</h4>
                    <TextInput label={t.cardTitle} id="scienceTitle" value={formData.scienceTitle} onChange={handleChange} />
                    <TextInput label={t.cardDescription} id="scienceDesc" value={formData.scienceDesc} onChange={handleChange} isTextarea/>
                </div>
                 <div className="p-4 rounded-md border dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 space-y-4">
                    <h4 className="font-bold text-md mb-2 text-brand-dark dark:text-white">{t.programCard2}</h4>
                    <TextInput label={t.cardTitle} id="artsTitle" value={formData.artsTitle} onChange={handleChange} />
                    <TextInput label={t.cardDescription} id="artsDesc" value={formData.artsDesc} onChange={handleChange} isTextarea/>
                </div>
                 <div className="p-4 rounded-md border dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 space-y-4">
                    <h4 className="font-bold text-md mb-2 text-brand-dark dark:text-white">{t.programCard3}</h4>
                    <TextInput label={t.cardTitle} id="athleticsTitle" value={formData.athleticsTitle} onChange={handleChange} />
                    <TextInput label={t.cardDescription} id="athleticsDesc" value={formData.athleticsDesc} onChange={handleChange} isTextarea/>
                </div>
                 <div className="p-4 rounded-md border dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 space-y-4">
                    <h4 className="font-bold text-md mb-2 text-brand-dark dark:text-white">{t.programCard4}</h4>
                    <TextInput label={t.cardTitle} id="languagesTitle" value={formData.languagesTitle} onChange={handleChange} />
                    <TextInput label={t.cardDescription} id="languagesDesc" value={formData.languagesDesc} onChange={handleChange} isTextarea/>
                </div>
                {renderSaveButton(['academicPrograms', 'academicSubtitle', 'scienceTitle', 'scienceDesc', 'artsTitle', 'artsDesc', 'athleticsTitle', 'athleticsDesc', 'languagesTitle', 'languagesDesc'])}
            </AccordionSection>
            
            <AccordionSection title={t.testimonialsSection}>
                <div className="p-4 rounded-md border dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50">
                    <h4 className="font-bold text-md mb-4 text-brand-dark dark:text-white">{t.testimonial1}</h4>
                    <TextInput label={t.quote} id="testimonial1Quote" value={formData.testimonial1Quote} onChange={handleChange} isTextarea />
                    <TextInput label={t.authorName} id="testimonial1Name" value={formData.testimonial1Name} onChange={handleChange} />
                    <TextInput label={t.authorRole} id="testimonial1Role" value={formData.testimonial1Role} onChange={handleChange} />
                    <ImageInput label={t.authorImage} id="testimonial1Image" currentImage={formData.testimonial1Image} onImageChange={(file) => handleImageChange('testimonial1Image', file)} />
                </div>
                <div className="mt-6 p-4 rounded-md border dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50">
                    <h4 className="font-bold text-md mb-4 text-brand-dark dark:text-white">{t.testimonial2}</h4>
                    <TextInput label={t.quote} id="testimonial2Quote" value={formData.testimonial2Quote} onChange={handleChange} isTextarea />
                    <TextInput label={t.authorName} id="testimonial2Name" value={formData.testimonial2Name} onChange={handleChange} />
                    <TextInput label={t.authorRole} id="testimonial2Role" value={formData.testimonial2Role} onChange={handleChange} />
                    <ImageInput label={t.authorImage} id="testimonial2Image" currentImage={formData.testimonial2Image} onImageChange={(file) => handleImageChange('testimonial2Image', file)} />
                </div>
                <div className="mt-6 p-4 rounded-md border dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50">
                    <h4 className="font-bold text-md mb-4 text-brand-dark dark:text-white">{t.testimonial3}</h4>
                    <TextInput label={t.quote} id="testimonial3Quote" value={formData.testimonial3Quote} onChange={handleChange} isTextarea />
                    <TextInput label={t.authorName} id="testimonial3Name" value={formData.testimonial3Name} onChange={handleChange} />
                    <TextInput label={t.authorRole} id="testimonial3Role" value={formData.testimonial3Role} onChange={handleChange} />
                    <ImageInput label={t.authorImage} id="testimonial3Image" currentImage={formData.testimonial3Image} onImageChange={(file) => handleImageChange('testimonial3Image', file)} />
                </div>
                 {renderSaveButton(['testimonial1Quote', 'testimonial1Name', 'testimonial1Role', 'testimonial1Image', 'testimonial2Quote', 'testimonial2Name', 'testimonial2Role', 'testimonial2Image', 'testimonial3Quote', 'testimonial3Name', 'testimonial3Role', 'testimonial3Image'])}
            </AccordionSection>

            <AccordionSection title={t.aboutPage}>
                <div className="p-4 rounded-md border dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 space-y-4">
                    <h4 className="font-bold text-md mb-2 text-brand-dark dark:text-white">{t.heroSection}</h4>
                    <TextInput label={t.sectionTitle} id="aboutPageTitle" value={formData.aboutPageTitle} onChange={handleChange} />
                    <TextInput label={t.subtitle} id="aboutPageSubtitle" value={formData.aboutPageSubtitle} onChange={handleChange} isTextarea />
                    <ImageInput label={t.backgroundImage} id="aboutPageBackgroundImage" currentImage={formData.aboutPageBackgroundImage} onImageChange={(file) => handleImageChange('aboutPageBackgroundImage', file)} />
                </div>
                <div className="p-4 rounded-md border dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 space-y-4">
                    <h4 className="font-bold text-md mb-2 text-brand-dark dark:text-white">{t.historySection}</h4>
                    <TextInput label={t.sectionTitle} id="historyTitle" value={formData.historyTitle} onChange={handleChange} />
                    <TextInput label={t.subtitle} id="historySubtitle" value={formData.historySubtitle} onChange={handleChange} />
                    <TextInput label={t.paragraph1} id="historyPara1" value={formData.historyPara1} onChange={handleChange} isTextarea />
                    <TextInput label={t.paragraph2} id="historyPara2" value={formData.historyPara2} onChange={handleChange} isTextarea />
                </div>
                <div className="p-4 rounded-md border dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 space-y-4">
                    <h4 className="font-bold text-md mb-2 text-brand-dark dark:text-white">{t.mottoSection}</h4>
                    <TextInput label={t.motto} id="motto" value={formData.motto} onChange={handleChange} />
                    <TextInput label={t.mottoTranslation} id="mottoTranslation" value={formData.mottoTranslation} onChange={handleChange} />
                </div>
                <div className="p-4 rounded-md border dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 space-y-4">
                    <h4 className="font-bold text-md mb-2 text-brand-dark dark:text-white">{t.leadershipSection}</h4>
                    <TextInput label={t.sectionTitle} id="leadershipTitle" value={formData.leadershipTitle} onChange={handleChange} />
                    <TextInput label={t.subtitle} id="leadershipSubtitle" value={formData.leadershipSubtitle} onChange={handleChange} />
                    <div className="p-2 border-t mt-2">
                        <h5 className="font-semibold my-2">{t.facultyMember} 1</h5>
                        <TextInput label={t.authorName} id="faculty1Name" value={formData.faculty1Name} onChange={handleChange} />
                        <TextInput label={t.authorRole} id="faculty1Title" value={formData.faculty1Title} onChange={handleChange} />
                        <TextInput label={t.bio} id="faculty1Bio" value={formData.faculty1Bio} onChange={handleChange} isTextarea />
                        <ImageInput label={t.authorImage} id="faculty1Image" currentImage={formData.faculty1Image} onImageChange={(file) => handleImageChange('faculty1Image', file)} />
                    </div>
                    <div className="p-2 border-t mt-2">
                        <h5 className="font-semibold my-2">{t.facultyMember} 2</h5>
                        <TextInput label={t.authorName} id="faculty2Name" value={formData.faculty2Name} onChange={handleChange} />
                        <TextInput label={t.authorRole} id="faculty2Title" value={formData.faculty2Title} onChange={handleChange} />
                        <TextInput label={t.bio} id="faculty2Bio" value={formData.faculty2Bio} onChange={handleChange} isTextarea />
                        <ImageInput label={t.authorImage} id="faculty2Image" currentImage={formData.faculty2Image} onImageChange={(file) => handleImageChange('faculty2Image', file)} />
                    </div>
                     <div className="p-2 border-t mt-2">
                        <h5 className="font-semibold my-2">{t.facultyMember} 3</h5>
                        <TextInput label={t.authorName} id="faculty3Name" value={formData.faculty3Name} onChange={handleChange} />
                        <TextInput label={t.authorRole} id="faculty3Title" value={formData.faculty3Title} onChange={handleChange} />
                        <TextInput label={t.bio} id="faculty3Bio" value={formData.faculty3Bio} onChange={handleChange} isTextarea />
                        <ImageInput label={t.authorImage} id="faculty3Image" currentImage={formData.faculty3Image} onImageChange={(file) => handleImageChange('faculty3Image', file)} />
                    </div>
                </div>
                 <div className="p-4 rounded-md border dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 space-y-4">
                    <h4 className="font-bold text-md mb-2 text-brand-dark dark:text-white">{t.facilitiesSection}</h4>
                    <TextInput label={t.sectionTitle} id="facilitiesTitle" value={formData.facilitiesTitle} onChange={handleChange} />
                    <TextInput label={t.subtitle} id="facilitiesSubtitle" value={formData.facilitiesSubtitle} onChange={handleChange} />
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="p-2 border-t mt-2">
                            <h5 className="font-semibold my-2">{t.facility} {i+1}</h5>
                            <TextInput label={t.cardTitle} id={`facility${i+1}Name`} value={formData[`facility${i+1}Name`]} onChange={handleChange} />
                            <TextInput label={t.cardDescription} id={`facility${i+1}Desc`} value={formData[`facility${i+1}Desc`]} onChange={handleChange} />
                            <ImageInput label={t.sectionImage} id={`facility${i+1}Image`} currentImage={formData[`facility${i+1}Image`]} onImageChange={(file) => handleImageChange(`facility${i+1}Image`, file)} />
                        </div>
                    ))}
                </div>
                {renderSaveButton(['aboutPageTitle', 'aboutPageSubtitle', 'aboutPageBackgroundImage', 'historyTitle', 'historySubtitle', 'historyPara1', 'historyPara2', 'motto', 'mottoTranslation', 'leadershipTitle', 'leadershipSubtitle', 'faculty1Name', 'faculty1Title', 'faculty1Bio', 'faculty1Image', 'faculty2Name', 'faculty2Title', 'faculty2Bio', 'faculty2Image', 'faculty3Name', 'faculty3Title', 'faculty3Bio', 'faculty3Image', 'facilitiesTitle', 'facilitiesSubtitle', 'facility1Name', 'facility1Desc', 'facility1Image', 'facility2Name', 'facility2Desc', 'facility2Image', 'facility3Name', 'facility3Desc', 'facility3Image', 'facility4Name', 'facility4Desc', 'facility4Image'])}
            </AccordionSection>

            <AccordionSection title={t.academicsPage}>
                <div className="p-4 rounded-md border dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 space-y-4">
                    <h4 className="font-bold text-md mb-2 text-brand-dark dark:text-white">{t.heroSection}</h4>
                    <TextInput label={t.sectionTitle} id="academicsPageTitle" value={formData.academicsPageTitle} onChange={handleChange} />
                    <TextInput label={t.subtitle} id="academicsPageSubtitle" value={formData.academicsPageSubtitle} onChange={handleChange} isTextarea />
                    <ImageInput label={t.backgroundImage} id="academicsPageBackgroundImage" currentImage={formData.academicsPageBackgroundImage} onImageChange={(file) => handleImageChange('academicsPageBackgroundImage', file)} />
                </div>
                <div className="p-4 rounded-md border dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 space-y-4">
                    <h4 className="font-bold text-md mb-2 text-brand-dark dark:text-white">{t.philosophySection}</h4>
                    <TextInput label={t.sectionTitle} id="academicPhilosophyTitle" value={formData.academicPhilosophyTitle} onChange={handleChange} />
                    <TextInput label={t.cardDescription} id="academicPhilosophyText" value={formData.academicPhilosophyText} onChange={handleChange} isTextarea/>
                    <div className="p-2 border-t mt-2">
                        <h5 className="font-semibold my-2">{t.featureCard} 1 (Core Subjects)</h5>
                        <TextInput label={t.cardTitle} id="coreSubjectsTitle" value={formData.coreSubjectsTitle} onChange={handleChange} />
                        <TextInput label={t.cardDescription} id="coreSubjectsDesc" value={formData.coreSubjectsDesc} onChange={handleChange} isTextarea />
                    </div>
                     <div className="p-2 border-t mt-2">
                        <h5 className="font-semibold my-2">{t.featureCard} 2 (Electives)</h5>
                        <TextInput label={t.cardTitle} id="electivesTitle" value={formData.electivesTitle} onChange={handleChange} />
                        <TextInput label={t.cardDescription} id="electivesDesc" value={formData.electivesDesc} onChange={handleChange} isTextarea />
                    </div>
                     <div className="p-2 border-t mt-2">
                        <h5 className="font-semibold my-2">{t.featureCard} 3 (Advanced)</h5>
                        <TextInput label={t.cardTitle} id="advancedStudiesTitle" value={formData.advancedStudiesTitle} onChange={handleChange} />
                        <TextInput label={t.cardDescription} id="advancedStudiesDesc" value={formData.advancedStudiesDesc} onChange={handleChange} isTextarea />
                    </div>
                </div>
                <div className="p-4 rounded-md border dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 space-y-4">
                    <h4 className="font-bold text-md mb-2 text-brand-dark dark:text-white">{t.programsSection}</h4>
                    <ImageInput label={`${t.programImage} (Science)`} id="academicsScienceImage" currentImage={formData.academicsScienceImage} onImageChange={(file) => handleImageChange('academicsScienceImage', file)} />
                    <ImageInput label={`${t.programImage} (Arts)`} id="academicsArtsImage" currentImage={formData.academicsArtsImage} onImageChange={(file) => handleImageChange('academicsArtsImage', file)} />
                    <ImageInput label={`${t.programImage} (Sports)`} id="academicsSportsImage" currentImage={formData.academicsSportsImage} onImageChange={(file) => handleImageChange('academicsSportsImage', file)} />
                    <ImageInput label={`${t.programImage} (Languages)`} id="academicsLangImage" currentImage={formData.academicsLangImage} onImageChange={(file) => handleImageChange('academicsLangImage', file)} />
                </div>
                 <div className="p-4 rounded-md border dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 space-y-4">
                    <h4 className="font-bold text-md mb-2 text-brand-dark dark:text-white">{t.ctaSection}</h4>
                    <TextInput label={t.sectionTitle} id="exploreCoursesTitle" value={formData.exploreCoursesTitle} onChange={handleChange} />
                    <TextInput label={t.subtitle} id="exploreCoursesSubtitle" value={formData.exploreCoursesSubtitle} onChange={handleChange} isTextarea />
                </div>
                {renderSaveButton(['academicsPageTitle', 'academicsPageSubtitle', 'academicsPageBackgroundImage', 'academicPhilosophyTitle', 'academicPhilosophyText', 'coreSubjectsTitle', 'coreSubjectsDesc', 'electivesTitle', 'electivesDesc', 'advancedStudiesTitle', 'advancedStudiesDesc', 'academicsScienceImage', 'academicsArtsImage', 'academicsSportsImage', 'academicsLangImage', 'exploreCoursesTitle', 'exploreCoursesSubtitle'])}
            </AccordionSection>
            
            <AccordionSection title={t.galleryManagement}>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{t.galleryManagementSubtitle}</p>
                
                <div className="p-4 rounded-md border dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50">
                    <h4 className="font-bold text-md mb-4 text-brand-dark dark:text-white">{t.currentGalleryImages}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {localGallery.map((img, index) => (
                            <div key={index} className="relative group">
                                <img src={img.src} alt={img.alt} className="w-full h-32 object-cover rounded-md" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-white text-center">
                                    <p className="text-xs font-bold truncate">{img.alt}</p>
                                    <p className="text-xs">{img.category}</p>
                                </div>
                                <button onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 bg-red-600/80 text-white rounded-full p-1 leading-none hover:bg-red-700">
                                    <DeleteIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 p-4 rounded-md border dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50">
                    <h4 className="font-bold text-md mb-4 text-brand-dark dark:text-white">{t.addImage}</h4>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="newImageFile" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t.imageFile}</label>
                            <input type="file" id="newImageFile" onChange={handleNewImageFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-blue/10 file:text-brand-blue hover:file:bg-brand-blue/20 dark:file:bg-brand-gold/20 dark:file:text-brand-gold dark:hover:file:bg-brand-gold/30" />
                            {newImage.src && <img src={newImage.src} alt="Preview" className="w-24 h-24 object-cover rounded-md mt-2" />}
                        </div>
                        <TextInput label={t.altText} id="newImageAlt" value={newImage.alt} onChange={(e) => setNewImage({...newImage, alt: e.target.value})} />
                        <TextInput label={t.category} id="newImageCategory" value={newImage.category} onChange={(e) => setNewImage({...newImage, category: e.target.value})} />
                        <button onClick={handleAddImage} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">{t.addNewImage}</button>
                    </div>
                </div>

                <div className="text-right mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <button
                        onClick={handleSaveGallery}
                        disabled={isSaving}
                        className="bg-brand-blue text-white font-bold py-2 px-6 rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-wait flex items-center gap-2 ml-auto"
                    >
                        <SaveIcon />
                        {isSaving ? t.saving : t.saveGalleryChanges}
                    </button>
                </div>
            </AccordionSection>

        </div>
    );
};

export default ContentManager;
