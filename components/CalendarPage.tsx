import React, { useState, useMemo } from 'react';
import AnimatedSection from './AnimatedSection';
import { useLanguage } from '../contexts/LanguageContext';
import { events as allEvents, SchoolEvent } from '../lib/eventsData';
import { ChevronLeftIcon, ChevronRightIcon } from './icons/CalendarIcons';

const CalendarPage: React.FC = () => {
    const { t } = useLanguage();
    const [currentDate, setCurrentDate] = useState(new Date());

    const eventMap = useMemo(() => {
        const map = new Map<string, SchoolEvent[]>();
        allEvents.forEach(event => {
            const dateKey = event.date;
            if (!map.has(dateKey)) {
                map.set(dateKey, []);
            }
            map.get(dateKey)!.push(event);
        });
        return map;
    }, [allEvents]);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const renderHeader = () => (
        <div className="flex justify-between items-center mb-6">
            <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Previous month">
                <ChevronLeftIcon />
            </button>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-blue dark:text-white">
                {t.months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Next month">
                <ChevronRightIcon />
            </button>
        </div>
    );

    const renderDays = () => (
        <div className="grid grid-cols-7 gap-1 text-center font-semibold text-gray-600 dark:text-gray-300">
            {t.days.map(day => <div key={day} className="py-2">{day}</div>)}
        </div>
    );
    
    const EventPill: React.FC<{ event: SchoolEvent }> = ({ event }) => {
        const typeStyles: Record<SchoolEvent['type'], string> = {
            holiday: 'bg-green-500',
            exam: 'bg-red-500',
            event: 'bg-blue-500',
            reminder: 'bg-yellow-500',
        };
        const bgColor = typeStyles[event.type];

        return (
            <div className="flex items-center text-left text-xs text-white p-1 rounded-md mb-1" style={{ backgroundColor: bgColor }}>
                <span className="font-semibold truncate">{t[event.nameKey as keyof typeof t]}</span>
            </div>
        );
    };

    const renderCells = () => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const cells = [];
        const today = new Date();
        today.setHours(0,0,0,0);

        for (let i = 0; i < firstDayOfMonth; i++) {
            cells.push(<div key={`empty-start-${i}`} className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-md"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const cellDate = new Date(year, month, day);
            const dateKey = cellDate.toISOString().split('T')[0];
            const isToday = cellDate.getTime() === today.getTime();
            const eventsForDay = eventMap.get(dateKey) || [];

            cells.push(
                <div key={day} className="border border-gray-200 dark:border-gray-700 p-2 min-h-[120px] rounded-md flex flex-col transition-colors duration-200 hover:bg-brand-light/50 dark:hover:bg-gray-700/50">
                    <div className={`font-bold self-end ${isToday ? 'bg-brand-blue text-white dark:bg-brand-gold dark:text-brand-blue rounded-full w-7 h-7 flex items-center justify-center' : 'text-gray-700 dark:text-gray-300'}`}>
                        {day}
                    </div>
                    <div className="flex-grow overflow-y-auto">
                        {eventsForDay.map((event, index) => <EventPill key={index} event={event} />)}
                    </div>
                </div>
            );
        }

        const totalCells = firstDayOfMonth + daysInMonth;
        const remainingCells = (7 - (totalCells % 7)) % 7;
        for (let i = 0; i < remainingCells; i++) {
            cells.push(<div key={`empty-end-${i}`} className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-md"></div>);
        }

        return <div className="grid grid-cols-7 gap-1">{cells}</div>;
    };
    
    const renderLegend = () => (
        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-gray-600 dark:text-gray-300">
            <div className="flex items-center"><span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>{t.eventHoliday}</div>
            <div className="flex items-center"><span className="w-4 h-4 rounded-full bg-red-500 mr-2"></span>{t.eventExam}</div>
            <div className="flex items-center"><span className="w-4 h-4 rounded-full bg-blue-500 mr-2"></span>{t.eventSchool}</div>
            <div className="flex items-center"><span className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></span>{t.eventReminder}</div>
        </div>
    );

    return (
        <div>
            {/* Hero Section */}
            <section className="relative h-[50vh] flex items-center justify-center text-center text-white bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/seed/calendar-hero/1920/1080')" }}>
                <div className="absolute inset-0 bg-brand-blue opacity-70"></div>
                <div className="relative z-10 px-4">
                    <AnimatedSection>
                        <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight tracking-wide">{t.calendarPageTitle}</h1>
                        <p className="text-lg md:text-xl max-w-3xl mx-auto mt-4 font-light">{t.calendarPageSubtitle}</p>
                    </AnimatedSection>
                </div>
            </section>

            {/* Calendar Section */}
            <AnimatedSection>
                <section className="py-20 bg-white dark:bg-gray-800">
                    <div className="container mx-auto px-6">
                        <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
                            {renderHeader()}
                            {renderDays()}
                            {renderCells()}
                            {renderLegend()}
                        </div>
                    </div>
                </section>
            </AnimatedSection>
        </div>
    );
};

export default CalendarPage;