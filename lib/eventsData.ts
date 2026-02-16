export interface SchoolEvent {
  date: string; // YYYY-MM-DD format
  nameKey: keyof typeof import('./translations').translations.en;
  type: 'holiday' | 'exam' | 'event' | 'reminder';
}

const currentYear = new Date().getFullYear();
const nextYear = currentYear + 1;

export const events: SchoolEvent[] = [
  // Current Year
  { date: `${currentYear}-09-02`, nameKey: 'firstDayOfSchool', type: 'event' },
  { date: `${currentYear}-10-25`, nameKey: 'parentTeacherConference', type: 'reminder' },
  { date: `${currentYear}-11-11`, nameKey: 'midtermExams', type: 'exam' },
  { date: `${currentYear}-11-12`, nameKey: 'midtermExams', type: 'exam' },
  { date: `${currentYear}-11-13`, nameKey: 'midtermExams', type: 'exam' },
  { date: `${currentYear}-12-23`, nameKey: 'winterBreak', type: 'holiday' },
  
  // Next Year
  { date: `${nextYear}-01-06`, nameKey: 'schoolResumes', type: 'event' },
  { date: `${nextYear}-02-14`, nameKey: 'scienceFair', type: 'event' },
  { date: `${nextYear}-03-17`, nameKey: 'springBreak', type: 'holiday' },
  { date: `${nextYear}-03-28`, nameKey: 'parentTeacherConference', type: 'reminder' },
  { date: `${nextYear}-05-19`, nameKey: 'finalExams', type: 'exam' },
  { date: `${nextYear}-05-20`, nameKey: 'finalExams', type: 'exam' },
  { date: `${nextYear}-05-21`, nameKey: 'finalExams', type: 'exam' },
  { date: `${nextYear}-05-22`, nameKey: 'finalExams', type: 'exam' },
  { date: `${nextYear}-06-06`, nameKey: 'graduationDay', type: 'event' },
  { date: `${nextYear}-06-13`, nameKey: 'lastDayOfSchool', type: 'reminder' },
];
