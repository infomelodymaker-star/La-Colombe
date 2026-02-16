import React, { useState, useMemo } from 'react';
import AnimatedSection from './AnimatedSection';
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronDownIcon } from './icons/InfoIcons';
import { SearchIcon } from './icons/AdminIcons';

type Course = {
  nameKey: keyof typeof import('../lib/translations').translations.en;
  descKey: keyof typeof import('../lib/translations').translations.en;
  prereqKey: keyof typeof import('../lib/translations').translations.en;
};

type Department = {
  nameKey: keyof typeof import('../lib/translations').translations.en;
  courses: Course[];
};

const courseData: Department[] = [
  {
    nameKey: 'postFondamentaleCategory',
    courses: [
      { nameKey: 'courseYear7', descKey: 'courseYear7Desc', prereqKey: 'noPrerequisites' },
      { nameKey: 'courseYear8', descKey: 'courseYear8Desc', prereqKey: 'noPrerequisites' },
      { nameKey: 'courseYear9', descKey: 'courseYear9Desc', prereqKey: 'noPrerequisites' },
    ],
  },
  {
    nameKey: 'sectionsCategory',
    courses: [
      { nameKey: 'courseMaintInfo', descKey: 'courseMaintInfoDesc', prereqKey: 'prereqBurundiTest' },
      { nameKey: 'courseGestInfo', descKey: 'courseGestInfoDesc', prereqKey: 'prereqBurundiTest' },
      { nameKey: 'courseTelInfo', descKey: 'courseTelInfoDesc', prereqKey: 'prereqBurundiTest' },
      { nameKey: 'courseBanque', descKey: 'courseBanqueDesc', prereqKey: 'prereqBurundiTest' },
      { nameKey: 'courseElectroMec', descKey: 'courseElectroMecDesc', prereqKey: 'prereqBurundiTest' },
      { nameKey: 'courseElecInd', descKey: 'courseElecIndDesc', prereqKey: 'prereqBurundiTest' },
      { nameKey: 'courseConducteurTravaux', descKey: 'courseConducteurTravauxDesc', prereqKey: 'prereqDiploma' },
    ],
  },
  {
    nameKey: 'profFormationsCategory',
    courses: [
      { nameKey: 'courseTic', descKey: 'courseTicDesc', prereqKey: 'noPrerequisites' },
      { nameKey: 'courseMecAuto', descKey: 'courseMecAutoDesc', prereqKey: 'noPrerequisites' },
    ],
  },
];


const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useLanguage();

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm mb-4 overflow-hidden bg-white dark:bg-gray-800">
            <button
                className="w-full flex justify-between items-center text-left p-4 md:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls={`course-details-${course.nameKey}`}
            >
                <h3 className="text-lg md:text-xl font-bold text-brand-blue dark:text-white">{t[course.nameKey]}</h3>
                 <div className="flex items-center text-sm font-semibold text-brand-blue dark:text-brand-gold">
                    <span className="mr-2 hidden sm:inline">{isOpen ? t.hideDetails : t.viewDetails}</span>
                    <ChevronDownIcon className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>
            <div
                id={`course-details-${course.nameKey}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`}
            >
                <div className="p-4 md:p-6 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{t[course.descKey]}</p>
                    <div className="text-sm">
                        <strong className="text-brand-dark dark:text-gray-200">{t.prerequisites}:</strong> <span className="text-gray-600 dark:text-gray-400">{t[course.prereqKey]}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CoursesPage: React.FC = () => {
    const { t } = useLanguage();
    const [activeDeptKey, setActiveDeptKey] = useState<keyof typeof import('../lib/translations').translations.en>('postFondamentaleCategory');
    const [searchTerm, setSearchTerm] = useState('');

    const activeDepartment = useMemo(() => {
        return courseData.find(dept => dept.nameKey === activeDeptKey);
    }, [activeDeptKey]);
    
    const filteredCourses = useMemo(() => {
        if (!activeDepartment) return [];
        if (!searchTerm.trim()) {
            return activeDepartment.courses;
        }
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return activeDepartment.courses.filter(course => {
            // Fix: The translation value `t[course.nameKey]` can be a `string[]`, which doesn't have `toLowerCase`.
            // Using `String()` safely converts both strings and string arrays to a string representation before calling `toLowerCase`.
            const name = String(t[course.nameKey]).toLowerCase();
            const description = String(t[course.descKey]).toLowerCase();
            return name.includes(lowercasedSearchTerm) || description.includes(lowercasedSearchTerm);
        });
    }, [activeDepartment, searchTerm, t]);
    
    // Fix: Correctly typed `deptKey` to match the specific keys of translations,
    // resolving the type mismatch with the `activeDeptKey` state. `keyof typeof t` was too broad.
    const handleDeptChange = (deptKey: keyof typeof import('../lib/translations').translations.en) => {
        setActiveDeptKey(deptKey);
        setSearchTerm(''); // Reset search on tab change
    };

    return (
        <div>
            {/* Hero Section */}
            <section className="relative h-[50vh] flex items-center justify-center text-center text-white bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/seed/courses-hero/1920/1080')" }}>
                <div className="absolute inset-0 bg-brand-blue opacity-70"></div>
                <div className="relative z-10 px-4">
                    <AnimatedSection>
                        <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight tracking-wide">{t.coursesPageTitle}</h1>
                        <p className="text-lg md:text-xl max-w-3xl mx-auto mt-4 font-light">{t.coursesPageSubtitle}</p>
                    </AnimatedSection>
                </div>
            </section>

            {/* Courses Section */}
            <AnimatedSection>
                <section className="py-20 bg-brand-light dark:bg-brand-dark">
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl mx-auto mb-8 relative">
                            <input
                                type="search"
                                placeholder="Search courses by name or keyword..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-blue/50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-brand-gold/50"
                                aria-label="Search courses"
                            />
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <SearchIcon className="w-5 h-5" />
                            </div>
                        </div>

                        <div className="flex justify-center flex-wrap gap-3 md:gap-4 mb-12">
                            {courseData.map(dept => (
                                <button
                                    key={dept.nameKey}
                                    onClick={() => handleDeptChange(dept.nameKey)}
                                    className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 text-sm md:text-base ${
                                        activeDeptKey === dept.nameKey
                                            ? 'bg-brand-blue text-white shadow-md'
                                            : 'bg-white text-gray-700 hover:bg-brand-gold hover:text-brand-blue shadow-sm dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-brand-gold dark:hover:text-brand-blue'
                                    }`}
                                >
                                    {t[dept.nameKey]}
                                </button>
                            ))}
                        </div>
                        
                        <div className="max-w-4xl mx-auto">
                           {filteredCourses.length > 0 ? (
                                filteredCourses.map(course => (
                                    <CourseCard key={course.nameKey} course={course} />
                                ))
                           ) : (
                                <div className="text-center py-12 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                                    <h3 className="text-xl font-semibold text-brand-dark dark:text-white">No courses found</h3>
                                    <p className="text-gray-600 dark:text-gray-300 mt-2">Try adjusting your search term.</p>
                                </div>
                           )}
                        </div>
                    </div>
                </section>
            </AnimatedSection>
        </div>
    );
};

export default CoursesPage;