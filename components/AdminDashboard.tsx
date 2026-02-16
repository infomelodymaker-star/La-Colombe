import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { LogoutIcon, ViewIcon, DeleteIcon, PendingIcon, ReviewedIcon, AcceptedIcon, RejectedIcon, SearchIcon, SortIcon, SortAscIcon, SortDescIcon, ContentIcon, ApplicationsIcon, SettingsIcon, AlertTriangleIcon } from './icons/AdminIcons';
import AnimatedSection from './AnimatedSection';
import ContentManager from './ContentManager';


type ApplicationStatus = 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected';
type SortDirection = 'ascending' | 'descending';
type DashboardView = 'applications' | 'content' | 'settings';

interface Application {
    id: string;
    firstName: string;
    lastName: string;
    dob: string;
    submissionDate: string;
    status: ApplicationStatus;
    [key: string]: any; // Allow other properties
}

const statusMap: Record<ApplicationStatus, { icon: React.FC<{className?: string}>; labelKey: keyof typeof import('../lib/translations').translations.en; classes: string }> = {
    Pending: { icon: PendingIcon, labelKey: 'statusPending', classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' },
    Reviewed: { icon: ReviewedIcon, labelKey: 'statusReviewed', classes: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' },
    Accepted: { icon: AcceptedIcon, labelKey: 'statusAccepted', classes: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
    Rejected: { icon: RejectedIcon, labelKey: 'statusRejected', classes: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' },
};

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 dark:text-white break-words">{value || 'N/A'}</dd>
    </div>
);

const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const { t, language } = useLanguage();
    const [applications, setApplications] = useState<Application[]>([]);
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'All'>('All');
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
    const [appToDelete, setAppToDelete] = useState<Application | null>(null);
    const [selectedAppIds, setSelectedAppIds] = useState<Set<string>>(new Set());
    const [isBulkDeleteConfirmOpen, setIsBulkDeleteConfirmOpen] = useState(false);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Application | null; direction: SortDirection }>({ key: 'submissionDate', direction: 'descending' });
    const [toast, setToast] = useState<{ message: string; visible: boolean, type: 'success' | 'error' }>({ message: '', visible: false, type: 'success' });
    const [view, setView] = useState<DashboardView>('applications');

    useEffect(() => {
        try {
            const storedApps = localStorage.getItem('school_applications');
            if (storedApps) {
                const parsedApps = JSON.parse(storedApps);
                if (Array.isArray(parsedApps)) {
                    setApplications(parsedApps);
                } else {
                    setApplications([]);
                }
            }
        } catch (error) {
            console.error("Failed to load applications from localStorage", error);
            setApplications([]); 
        }
    }, []);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, visible: true, type });
        setTimeout(() => {
            setToast({ message: '', visible: false, type: 'success' });
        }, 5000); // Hide after 5 seconds
    };

    const sortedAndFilteredApplications = useMemo(() => {
        if (!Array.isArray(applications)) return [];

        let filtered = applications.filter(app => {
            if (typeof app !== 'object' || app === null) return false;

            const matchesSearch = searchTerm === '' || `${String(app.firstName ?? '')} ${String(app.lastName ?? '')}`.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        if (sortConfig.key) {
            filtered.sort((a, b) => {
                const aValue = a[sortConfig.key!];
                const bValue = b[sortConfig.key!];

                if (aValue == null && bValue == null) return 0;
                if (aValue == null) return 1; 
                if (bValue == null) return -1;

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        
        return filtered;
    }, [applications, searchTerm, statusFilter, sortConfig]);

    const requestSort = (key: keyof Application) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };
    
    const updateApplicationStatus = (appId: string, newStatus: ApplicationStatus) => {
        let applicantName = '';
        const updatedApps = applications.map(app => {
            if (app.id === appId) {
                applicantName = `${app.firstName} ${app.lastName}`;
                return { ...app, status: newStatus };
            }
            return app;
        });
        setApplications(updatedApps);
        localStorage.setItem('school_applications', JSON.stringify(updatedApps));
        
        if (selectedApp?.id === appId) {
            setSelectedApp({ ...selectedApp, status: newStatus });
        }

        if ((newStatus === 'Accepted' || newStatus === 'Rejected') && applicantName) {
            const statusText = String(t[statusMap[newStatus].labelKey]).toLowerCase();
            const message = t.emailSentConfirmation
                .replace('{status}', statusText)
                .replace('{name}', applicantName);
            showToast(message);
        }
    };
    
    const openDeleteConfirm = (app: Application) => {
        setAppToDelete(app);
        setIsDeleteConfirmOpen(true);
    };

    const handleDelete = () => {
        if (!appToDelete) return;
        const updatedApps = applications.filter(app => app.id !== appToDelete.id);
        setApplications(updatedApps);
        localStorage.setItem('school_applications', JSON.stringify(updatedApps));
        setIsDeleteConfirmOpen(false);
        setAppToDelete(null);
        if (selectedApp?.id === appToDelete.id) {
            setSelectedApp(null);
        }
    };
    
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allIds = new Set(sortedAndFilteredApplications.map(app => app.id));
            setSelectedAppIds(allIds);
        } else {
            setSelectedAppIds(new Set());
        }
    };

    const handleSelectOne = (appId: string) => {
        const newSelection = new Set(selectedAppIds);
        if (newSelection.has(appId)) {
            newSelection.delete(appId);
        } else {
            newSelection.add(appId);
        }
        setSelectedAppIds(newSelection);
    };

    const openBulkDeleteConfirm = () => {
        setIsBulkDeleteConfirmOpen(true);
    };

    const handleBulkDelete = () => {
        const updatedApps = applications.filter(app => !selectedAppIds.has(app.id));
        setApplications(updatedApps);
        localStorage.setItem('school_applications', JSON.stringify(updatedApps));
        setSelectedAppIds(new Set());
        setIsBulkDeleteConfirmOpen(false);
    };

    const handleResetData = () => {
        localStorage.removeItem('school_applications');
        localStorage.removeItem('website_content_en');
        localStorage.removeItem('website_content_fr');
        localStorage.removeItem('admin_password');
        localStorage.removeItem('admission_form_data');
        localStorage.removeItem('language');
        localStorage.removeItem('theme');
        localStorage.removeItem('cookie_consent');
        
        setIsResetConfirmOpen(false);
        
        showToast(t.dataClearedToast, 'success');

        setTimeout(() => {
            onLogout();
            window.location.reload();
        }, 2000);
    };

    const getSortIcon = (key: keyof Application) => {
        if (sortConfig.key !== key) return <SortIcon />;
        if (sortConfig.direction === 'ascending') return <SortAscIcon />;
        return <SortDescIcon />;
    };
    
    const renderApplicationsView = () => (
        <>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
                <h2 className="text-xl font-bold text-brand-dark dark:text-white">{t.totalApplications}: {applications.length}</h2>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={t.searchApplicants}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue/50 dark:focus:ring-brand-gold/50"
                        />
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value as ApplicationStatus | 'All')}
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue/50 dark:focus:ring-brand-gold/50"
                    >
                        <option value="All">{t.allStatuses}</option>
                        {Object.keys(statusMap).map(status => (
                            <option key={status} value={status}>{t[statusMap[status as ApplicationStatus].labelKey]}</option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedAppIds.size > 0 && (
                <div className="mb-4 flex items-center justify-between bg-brand-blue/10 dark:bg-brand-blue/20 p-3 rounded-lg">
                    <span className="font-semibold text-brand-blue dark:text-white">{selectedAppIds.size} {t.selected}</span>
                    <button
                        onClick={openBulkDeleteConfirm}
                        className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm"
                    >
                        <DeleteIcon />
                        {t.deleteSelected}
                    </button>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-4 w-4 text-brand-blue rounded border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 focus:ring-brand-blue dark:focus:ring-brand-gold dark:ring-offset-gray-800"
                                    onChange={handleSelectAll}
                                    checked={sortedAndFilteredApplications.length > 0 && selectedAppIds.size === sortedAndFilteredApplications.length}
                                    aria-label="Select all applications"
                                />
                            </th>
                            <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                <button onClick={() => requestSort('lastName')} className="flex items-center gap-2 hover:text-brand-blue dark:hover:text-brand-gold">
                                    {t.thName} {getSortIcon('lastName')}
                                </button>
                            </th>
                            <th scope="col" className="px-6 py-3 whitespace-nowrap hidden md:table-cell">
                                <button onClick={() => requestSort('dob')} className="flex items-center gap-2 hover:text-brand-blue dark:hover:text-brand-gold">
                                    {t.thDob} {getSortIcon('dob')}
                                </button>
                            </th>
                            <th scope="col" className="px-6 py-3 whitespace-nowrap hidden lg:table-cell">
                                <button onClick={() => requestSort('submissionDate')} className="flex items-center gap-2 hover:text-brand-blue dark:hover:text-brand-gold">
                                    {t.thSubmitted} {getSortIcon('submissionDate')}
                                </button>
                            </th>
                            <th scope="col" className="px-6 py-3">{t.thStatus}</th>
                            <th scope="col" className="px-6 py-3 text-right">{t.thActions}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedAndFilteredApplications.length > 0 ? sortedAndFilteredApplications.map(app => (
                            <tr key={app.id} className={`border-b dark:border-gray-700 transition-colors duration-200 ${selectedAppIds.has(app.id) ? 'bg-brand-blue/5 dark:bg-brand-blue/20' : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600'}`}>
                                <td className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-4 w-4 text-brand-blue rounded border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 focus:ring-brand-blue dark:focus:ring-brand-gold dark:ring-offset-gray-800"
                                        checked={selectedAppIds.has(app.id)}
                                        onChange={() => handleSelectOne(app.id)}
                                        aria-label={`Select application from ${app.firstName} ${app.lastName}`}
                                    />
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{app.firstName} {app.lastName}</td>
                                <td className="px-6 py-4 hidden md:table-cell">{app.dob}</td>
                                <td className="px-6 py-4 hidden lg:table-cell">{new Date(app.submissionDate).toLocaleDateString(language)}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 font-semibold leading-tight rounded-full text-xs flex items-center w-fit ${statusMap[app.status].classes}`}>
                                        {React.createElement(statusMap[app.status].icon, { className: 'w-3 h-3 mr-1' })}
                                        {t[statusMap[app.status].labelKey]}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button onClick={() => setSelectedApp(app)} className="font-medium text-brand-blue dark:text-brand-gold hover:underline p-1" title={t.actionView}><ViewIcon /></button>
                                    <button onClick={() => openDeleteConfirm(app)} className="font-medium text-red-600 dark:text-red-500 hover:underline p-1" title={t.actionDelete}><DeleteIcon /></button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">{t.noApplications}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );

    const renderSettingsView = () => (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-brand-dark dark:text-white mb-2">{t.settings}</h2>
            <div className="mt-6 p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-500/50 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">{t.resetData}</h3>
                <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                    {t.resetDataWarning}
                </p>
                <div className="mt-4">
                    <button
                        onClick={() => setIsResetConfirmOpen(true)}
                        className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                        <AlertTriangleIcon className="w-5 h-5" />
                        {t.clearAllData}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-brand-light dark:bg-brand-dark min-h-screen">
            <header className="bg-white dark:bg-gray-800 shadow-md">
                <div className="container mx-auto px-6 py-4 flex flex-wrap justify-between items-center gap-4">
                    <h1 className="text-2xl font-serif font-bold text-brand-blue dark:text-white">
                        {t.dashboardTitle}
                    </h1>
                    <button onClick={onLogout} className="flex items-center font-semibold text-gray-600 dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-gold transition-colors">
                        <LogoutIcon />
                        <span className="ml-2 hidden sm:inline">{t.logout}</span>
                    </button>
                </div>
                 <div className="container mx-auto px-6 border-t border-gray-200 dark:border-gray-700">
                    <nav className="flex justify-around sm:justify-start sm:gap-4">
                        <button 
                            onClick={() => setView('applications')}
                            className={`flex items-center gap-2 py-3 px-4 sm:px-2 border-b-2 font-semibold transition-colors ${view === 'applications' ? 'border-brand-blue text-brand-blue dark:border-brand-gold dark:text-brand-gold' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                        >
                            <ApplicationsIcon /> <span className="hidden sm:inline">{t.dashboardTitle}</span>
                        </button>
                         <button 
                            onClick={() => setView('content')}
                            className={`flex items-center gap-2 py-3 px-4 sm:px-2 border-b-2 font-semibold transition-colors ${view === 'content' ? 'border-brand-blue text-brand-blue dark:border-brand-gold dark:text-brand-gold' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                        >
                            <ContentIcon /> <span className="hidden sm:inline">{t.contentManagement}</span>
                        </button>
                        <button 
                            onClick={() => setView('settings')}
                            className={`flex items-center gap-2 py-3 px-4 sm:px-2 border-b-2 font-semibold transition-colors ${view === 'settings' ? 'border-brand-blue text-brand-blue dark:border-brand-gold dark:text-brand-gold' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                        >
                            <SettingsIcon /> <span className="hidden sm:inline">{t.settings}</span>
                        </button>
                    </nav>
                </div>
            </header>
            
            <main className="container mx-auto px-6 py-8">
                <AnimatedSection>
                    {view === 'applications' && renderApplicationsView()}
                    {view === 'content' && <ContentManager showToast={showToast} />}
                    {view === 'settings' && renderSettingsView()}
                </AnimatedSection>
            </main>
            
            {/* Details Modal */}
            {selectedApp && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedApp(null)}>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                            <h3 className="text-2xl font-serif font-bold text-brand-blue dark:text-white">{t.applicationDetails}</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                <DetailRow label={t.thName} value={`${selectedApp.firstName} ${selectedApp.lastName}`} />
                                <DetailRow label={t.dob} value={selectedApp.dob} />
                                <DetailRow label={t.gender} value={selectedApp.gender} />
                                <DetailRow label={t.thSubmitted} value={new Date(selectedApp.submissionDate).toLocaleString(language)} />
                                <DetailRow label={t.emailAddress} value={selectedApp.email} />
                                <DetailRow label={t.phoneNumber} value={selectedApp.phone} />
                            </dl>
                            <dl className="space-y-4">
                               <DetailRow label={t.address} value={selectedApp.address} />
                            </dl>
                            <div className="border-t dark:border-gray-700 pt-4">
                                <h4 className="font-semibold text-lg text-brand-dark dark:text-white mb-2">{t.guardianInformation}</h4>
                                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                    <DetailRow label={t.guardian1Name} value={selectedApp.guardian1Name} />
                                    <DetailRow label={t.guardian1Relationship} value={selectedApp.guardian1Relationship} />
                                    <DetailRow label={t.guardian1Email} value={selectedApp.guardian1Email} />
                                    <DetailRow label={t.guardian1Phone} value={selectedApp.guardian1Phone} />
                                     {selectedApp.guardian2Name && <DetailRow label={t.guardian2Name} value={selectedApp.guardian2Name} />}
                                </dl>
                            </div>
                             <div className="border-t dark:border-gray-700 pt-4">
                                <h4 className="font-semibold text-lg text-brand-dark dark:text-white mb-2">{t.academicInfo}</h4>
                                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                    <DetailRow label={t.prevSchool} value={selectedApp.prevSchool} />
                                    <DetailRow label={t.prevSchoolCity} value={selectedApp.prevSchoolCity} />
                                    <DetailRow label={t.currentGrade} value={selectedApp.currentGrade} />
                                    <DetailRow label={t.transcript} value={selectedApp.transcript} />
                                </dl>
                                <div className="mt-4">
                                    <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.personalEssay}</h5>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md whitespace-pre-wrap">{selectedApp.essay}</p>
                                </div>
                            </div>
                            <div className="border-t dark:border-gray-700 pt-4">
                                <label htmlFor="status-update" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.changeStatus}</label>
                                <select 
                                    id="status-update" 
                                    value={selectedApp.status}
                                    onChange={(e) => updateApplicationStatus(selectedApp.id, e.target.value as ApplicationStatus)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                                >
                                    {Object.keys(statusMap).map(status => (
                                        <option key={status} value={status}>{t[statusMap[status as ApplicationStatus].labelKey]}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="p-6 border-t dark:border-gray-700 flex justify-end sticky bottom-0 bg-gray-50 dark:bg-gray-800/80 backdrop-blur-sm">
                            <button onClick={() => setSelectedApp(null)} className="bg-brand-blue text-white font-bold py-2 px-6 rounded-full hover:bg-opacity-90 transition-all duration-300">
                                {t.close}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Single Delete Confirmation Modal */}
            {isDeleteConfirmOpen && appToDelete && (
                 <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-sm w-full p-6 text-center">
                        <DeleteIcon className="mx-auto w-12 h-12 text-red-500" />
                        <h3 className="text-xl font-bold text-brand-dark dark:text-white mt-4">{t.confirmDeleteTitle}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">{t.confirmDeleteText}</p>
                        <div className="mt-6 flex justify-center gap-4">
                            <button onClick={() => setIsDeleteConfirmOpen(false)} className="px-6 py-2 rounded-full font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">{t.cancel}</button>
                            <button onClick={handleDelete} className="px-6 py-2 rounded-full font-semibold text-white bg-red-600 hover:bg-red-700">{t.confirm}</button>
                        </div>
                    </div>
                 </div>
            )}

            {/* Bulk Delete Confirmation Modal */}
            {isBulkDeleteConfirmOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-sm w-full p-6 text-center">
                        <DeleteIcon className="mx-auto w-12 h-12 text-red-500" />
                        <h3 className="text-xl font-bold text-brand-dark dark:text-white mt-4">{t.confirmBulkDeleteTitle}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">{t.confirmBulkDeleteText}</p>
                        <div className="mt-6 flex justify-center gap-4">
                            <button onClick={() => setIsBulkDeleteConfirmOpen(false)} className="px-6 py-2 rounded-full font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">{t.cancel}</button>
                            <button onClick={handleBulkDelete} className="px-6 py-2 rounded-full font-semibold text-white bg-red-600 hover:bg-red-700">{t.confirm}</button>
                        </div>
                    </div>
                 </div>
            )}

            {/* Reset Confirmation Modal */}
            {isResetConfirmOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-sm w-full p-6 text-center">
                        <AlertTriangleIcon className="mx-auto w-12 h-12 text-red-500" />
                        <h3 className="text-xl font-bold text-brand-dark dark:text-white mt-4">{t.resetConfirmTitle}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                            {t.resetConfirmText}
                        </p>
                        <div className="mt-6 flex justify-center gap-4">
                            <button onClick={() => setIsResetConfirmOpen(false)} className="px-6 py-2 rounded-full font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">{t.cancel}</button>
                            <button onClick={handleResetData} className="px-6 py-2 rounded-full font-semibold text-white bg-red-600 hover:bg-red-700">{t.yesReset}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast.visible && (
                <div 
                    role="alert"
                    className={`fixed top-24 right-8 z-[100] flex items-center p-4 max-w-sm w-full text-white rounded-lg shadow-lg animate-slide-in-right ${toast.type === 'success' ? 'bg-green-500 dark:bg-green-600' : 'bg-red-500 dark:bg-red-600'}`}
                >
                    <div className="flex-shrink-0">
                        {toast.type === 'success' ? <AcceptedIcon className="w-6 h-6"/> : <RejectedIcon className="w-6 h-6"/>}
                    </div>
                    <div className="ml-3 text-sm font-medium">
                        {toast.message}
                    </div>
                    <button 
                        type="button" 
                        className={`ml-auto -mx-1.5 -my-1.5 text-white rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8 ${toast.type === 'success' ? 'bg-green-500 hover:bg-green-600 focus:ring-green-400 dark:bg-green-600 dark:hover:bg-green-700' : 'bg-red-500 hover:bg-red-600 focus:ring-red-400 dark:bg-red-600 dark:hover:bg-red-700'}`}
                        aria-label="Close"
                        onClick={() => setToast({ message: '', visible: false, type: 'success' })}
                    >
                        <span className="sr-only">Close</span>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                </div>
            )}
            <style>{`
                @keyframes slide-in-right {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
