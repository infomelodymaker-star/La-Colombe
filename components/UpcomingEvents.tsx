import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { events as allEvents, SchoolEvent } from '../lib/eventsData';
import { CalendarIcon } from './icons/InfoIcons';

interface UpcomingEventsProps {
  navigateTo: (page: string) => void;
}

const EventTypePill: React.FC<{ type: SchoolEvent['type'] }> = ({ type }) => {
    const { t } = useLanguage();
    const typeStyles: Record<SchoolEvent['type'], { text: string; classes: string }> = {
        holiday: { text: t.eventHoliday, classes: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
        exam: { text: t.eventExam, classes: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' },
        event: { text: t.eventSchool, classes: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' },
        reminder: { text: t.eventReminder, classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' },
    };
    const style = typeStyles[type];
    return <span className={`text-xs font-semibold px-2 py-1 rounded-full ${style.classes}`}>{style.text}</span>;
};

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ navigateTo }) => {
  const { t, language } = useLanguage();

  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  const upcomingEvents = allEvents
    .filter(event => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  return (
    <section id="upcoming-events" className="py-20 bg-brand-light dark:bg-brand-dark">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-brand-blue dark:text-white">{t.upcomingEventsTitle}</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{t.upcomingEventsSubtitle}</p>
        </div>
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            {upcomingEvents.length > 0 ? (
                <ul className="space-y-6">
                    {upcomingEvents.map((event, index) => {
                        const eventDate = new Date(event.date);
                        const formattedDate = eventDate.toLocaleDateString(language, { month: 'long', day: 'numeric' });
                        const dayOfWeek = eventDate.toLocaleDateString(language, { weekday: 'long' });

                        return (
                            <li key={index} className="flex items-center space-x-4 pb-4 border-b last:border-b-0 border-gray-100 dark:border-gray-700">
                                <div className="flex-shrink-0 w-16 h-16 flex flex-col items-center justify-center bg-brand-gold/10 text-brand-blue dark:text-brand-gold rounded-lg">
                                    <span className="text-2xl font-bold">{eventDate.getDate()}</span>
                                    <span className="text-xs font-semibold uppercase">{eventDate.toLocaleDateString(language, { month: 'short' })}</span>
                                </div>
                                <div className="flex-grow">
                                    <p className="font-bold text-brand-blue dark:text-white text-lg">{t[event.nameKey as keyof typeof t]}</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">{dayOfWeek}</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <EventTypePill type={event.type} />
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">No upcoming events. Please check back later.</p>
            )}
        </div>
        <div className="text-center mt-12">
            <button 
              onClick={() => navigateTo('calendar_page')}
              className="bg-brand-blue text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 inline-flex items-center"
            >
              <CalendarIcon className="w-5 h-5 mr-2" />
              {t.viewFullCalendar}
            </button>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;