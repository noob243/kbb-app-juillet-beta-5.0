import React, { useState, useEffect } from 'react';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import CasesPage from './pages/CasesPage';
import ProceduresPage from './pages/ProceduresPage';
import EventsPage from './pages/EventsPage';
import AgendaPage from './pages/AgendaPage';
import ChatPage from './pages/ChatPage';
import BillingPage from './pages/BillingPage';
import AvocatsPage from './pages/AvocatsPage';
import PersonnelsPage from './pages/PersonnelsPage';
import FournisseursPage from './pages/FournisseursPage';
import GestionPage from './pages/GestionPage';
import AllInterfacesPage from './pages/AllInterfacesPage';
import AIAssistantPage from './pages/AIAssistantPage';
import AuditLogsPage from './pages/AuditLogsPage';
import CorrespondancePage from './pages/CorrespondancePage';
import { Client, Case, Event, Task, Invoice, Avocat, Personnel, Fournisseur, AuditLog, Correspondance } from './types';
import { playAlarmSound, stopAllAlarmSounds } from './utils/audio';

// API Service
import { apiService } from './services/api';

// Firebase core configuration (Keeping for Auth if needed)
import { auth } from './firebase.ts';

import { motion, AnimatePresence } from 'motion/react';
import EmailComposerModal from './components/modals/EmailComposerModal';
import { ProtectedGuard } from './components/auth/ProtectedGuard';
import { AppUser } from './types/rbac';
import { ALL_MODULE_PERMISSIONS } from './services/rbacService';
import { syncUsersWithBackend } from './services/userService';

declare const jspdf: any;

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        try { return sessionStorage.getItem('kbb_auth') === 'true'; } catch (e) { return false; }
    });
    const [currentUserInfo, setCurrentUserInfo] = useState<{ name: string; role: string; email: string } | null>(() => {
        try {
            const stored = sessionStorage.getItem('kbb_currentUserInfo');
            return stored ? JSON.parse(stored) : null;
        } catch (e) { return null; }
    });
    const [currentUserObj, setCurrentUserObj] = useState<AppUser | null>(null);
    const [usersList, setUsersList] = useState<AppUser[]>([]);
    const [currentPage, setCurrentPage] = useState('Dashboard');

    // Persist login session to sessionStorage
    useEffect(() => {
        try {
            sessionStorage.setItem('kbb_auth', String(isAuthenticated));
            if (currentUserInfo) {
                sessionStorage.setItem('kbb_currentUserInfo', JSON.stringify(currentUserInfo));
            } else {
                sessionStorage.removeItem('kbb_currentUserInfo');
            }
        } catch (e) {}
    }, [isAuthenticated, currentUserInfo]);

    // Sync users list (now via API)
    useEffect(() => {
        let unsub: (() => void) | undefined;
        syncUsersWithBackend((latestUsers) => {
            setUsersList(latestUsers);
        }).then(cleanup => {
            unsub = cleanup;
        });
        return () => {
            if (unsub) unsub();
        };
    }, []);

    // Set currentUserObj based on usersList and currentUserInfo
    useEffect(() => {
        if (currentUserInfo?.email) {
            const cleanEmail = currentUserInfo.email.trim().toLowerCase();
            const found = usersList.find(u => u.email.trim().toLowerCase() === cleanEmail);
            const isSuperAdminEmail = cleanEmail === 'jeremieshusu4@gmail.com' ||
                cleanEmail === 'hervemich@icloud.com' ||
                cleanEmail === 'admin@cabinet.com';

            if (found) {
                if (isSuperAdminEmail || found.role === 'Admin') {
                    setCurrentUserObj({
                        ...found,
                        role: 'Admin',
                        permissions: ALL_MODULE_PERMISSIONS.map(m => m.key)
                    });
                } else {
                    setCurrentUserObj(found);
                }
            } else if (isSuperAdminEmail || currentUserInfo.role === 'Admin') {
                setCurrentUserObj({
                    id: 'admin-default',
                    email: currentUserInfo.email,
                    fullName: currentUserInfo.name,
                    role: 'Admin',
                    personnelCategory: 'Administratif',
                    hasAppAccess: true,
                    permissions: ALL_MODULE_PERMISSIONS.map(m => m.key),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    isDeleted: false,
                    status: 'Actif'
                });
            }
        } else {
            setCurrentUserObj(null);
        }
    }, [currentUserInfo, usersList]);

    const [searchQuery, setSearchQuery] = useState('');
    const [activeAlarmTask, setActiveAlarmTask] = useState<Task | null>(null);
    const stopActiveAlarmRef = React.useRef<(() => void) | null>(null);
    
    // Core collection states
    const [clients, setClients] = useState<Client[]>([]);
    const [cases, setCases] = useState<Case[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [avocats, setAvocats] = useState<Avocat[]>([]);
    const [personnels, setPersonnels] = useState<Personnel[]>([]);
    const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [correspondances, setCorrespondances] = useState<Correspondance[]>([]);
    const [presences, setPresences] = useState<{ [email: string]: any }>({});

    const [isDbConnected, setIsDbConnected] = useState(false);
    const [isSyncComplete, setIsSyncComplete] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const [toasts, setToasts] = useState<{ id: string, type: 'success' | 'error', text: string }[]>([]);
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {}
    });

    const [emailConfig, setEmailConfig] = useState<{
        isOpen: boolean;
        to: string;
        subject: string;
        body: string;
        recipientName?: string;
        attachmentName?: string;
    }>({
        isOpen: false,
        to: '',
        subject: '',
        body: '',
        recipientName: '',
        attachmentName: ''
    });

    const triggerEmail = (to: string, subject: string, body: string, recipientName?: string, attachmentName?: string) => {
        setEmailConfig({
            isOpen: true,
            to,
            subject,
            body,
            recipientName,
            attachmentName
        });
    };

    const triggerToast = (type: 'success' | 'error', text: string) => {
        const id = Math.random().toString();
        setToasts(prev => [...prev, { id, type, text }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 5000);
    };

    // Data Fetching
    const fetchAllData = async () => {
        try {
            const [
                clientsData, casesData, eventsData, tasksData,
                invoicesData, avocatsData, personnelsData,
                fournisseursData, logsData, correspondancesData
            ] = await Promise.all([
                apiService.clients.getAll(),
                apiService.cases.getAll(),
                apiService.events.getAll(),
                apiService.tasks.getAll(),
                apiService.invoices.getAll(),
                apiService.avocats.getAll(),
                apiService.personnels.getAll(),
                apiService.fournisseurs.getAll(),
                apiService.auditLogs.getAll(),
                apiService.correspondances.getAll(),
            ]);

            setClients(clientsData);
            setCases(casesData);
            setEvents(eventsData);
            setTasks(tasksData);
            setInvoices(invoicesData);
            setAvocats(avocatsData);
            setPersonnels(personnelsData);
            setFournisseurs(fournisseursData);
            setLogs(logsData);
            setCorrespondances(correspondancesData);

            setIsDbConnected(true);
            setIsSyncComplete(true);
            console.log("🚀 Data loaded from MongoDB Atlas");
        } catch (error) {
            console.error("❌ Error fetching data:", error);
            triggerToast('error', "Échec de connexion au serveur API.");
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    // Task reminder observer
    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission();
            }
        }

        const interval = setInterval(() => {
            if (activeAlarmTask) return;

            const now = new Date();
            const currentLocalDateString = now.toISOString().split('T')[0];
            const currentLocalTimeString = now.toTimeString().slice(0, 5);

            const pendingReminder = tasks.find(t => {
                if (!t.reminderEnabled || t.reminderTriggered || t.status === 'Effectué') return false;
                const scheduledDate = t.reminderDate || '';
                const scheduledTime = t.reminderTime || '';
                if (!scheduledDate || !scheduledTime) return false;
                if (scheduledDate < currentLocalDateString) return true;
                else if (scheduledDate === currentLocalDateString) return scheduledTime <= currentLocalTimeString;
                return false;
            });

            if (pendingReminder) {
                setActiveAlarmTask(pendingReminder);
                const soundType = pendingReminder.reminderSound || 'digital';
                stopActiveAlarmRef.current = playAlarmSound(soundType, 0.7);
                if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
                    new Notification(`Rappel: ${pendingReminder.name}`, {
                        body: `Échéance à ${pendingReminder.reminderTime}\nResponsable: ${pendingReminder.lawyer}`,
                        icon: '/favicon.ico',
                        requireInteraction: true
                    });
                }
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [tasks, activeAlarmTask]);

    const handleDismissAlarm = async () => {
        if (!activeAlarmTask) return;
        if (stopActiveAlarmRef.current) stopActiveAlarmRef.current();
        stopAllAlarmSounds();

        try {
            const updated = { ...activeAlarmTask, reminderTriggered: true };
            await apiService.tasks.update(updated.id, updated);
            setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
            setActiveAlarmTask(null);
            triggerToast('success', "Rappel acquitté.");
        } catch (err) { console.error(err); }
    };

    const handleSnoozeAlarm = async () => {
        if (!activeAlarmTask) return;
        if (stopActiveAlarmRef.current) stopActiveAlarmRef.current();
        stopAllAlarmSounds();

        const now = new Date();
        now.setMinutes(now.getMinutes() + 5);
        const snoozedDate = now.toISOString().split('T')[0];
        const snoozedTime = now.toTimeString().slice(0, 5);

        try {
            const updated = { ...activeAlarmTask, reminderDate: snoozedDate, reminderTime: snoozedTime, reminderTriggered: false };
            await apiService.tasks.update(updated.id, updated);
            setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
            setActiveAlarmTask(null);
            triggerToast('success', `Régler pour ${snoozedTime}`);
        } catch (err) { console.error(err); }
    };

    const logActivity = async (actionType: any, module: string, description: string, details?: any) => {
        const log = {
            id: `log_${Date.now()}`,
            timestamp: new Date().toISOString(),
            userEmail: currentUserInfo?.email || 'anonyme@kbb.cd',
            userName: currentUserInfo?.name || 'Utilisateur Anonyme',
            actionType,
            module,
            description,
            details
        };
        try {
            await apiService.auditLogs.create(log);
            setLogs(prev => [log as AuditLog, ...prev]);
        } catch (e) { console.error(e); }
    };

    // --- CRUD Handlers ---

    const handleAddClient = async (newClient: any) => {
        try {
            const saved = await apiService.clients.create(newClient);
            setClients(prev => [...prev, saved]);
            triggerToast('success', `Client "${saved.name}" ajouté.`);
            logActivity('Ajout', 'Clients', `Création du client "${saved.name}"`);
        } catch (err) { triggerToast('error', "Erreur."); }
    };

    const handleUpdateClient = async (updated: Client) => {
        try {
            const saved = await apiService.clients.update(updated.id, updated);
            setClients(prev => prev.map(c => c.id === updated.id ? saved : c));
            triggerToast('success', "Client mis à jour.");
        } catch (err) { triggerToast('error', "Erreur."); }
    };

    const handleDeleteClient = (id: number | string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Supprimer ce client ?',
            message: 'Action irréversible.',
            onConfirm: async () => {
                try {
                    await apiService.clients.delete(id);
                    setClients(prev => prev.filter(c => c.id !== id));
                    triggerToast('success', "Supprimé.");
                } catch (err) { triggerToast('error', "Erreur."); }
            }
        });
    };

    const handleAddCase = async (newCase: any) => {
        try {
            const saved = await apiService.cases.create(newCase);
            setCases(prev => [...prev, saved]);
            triggerToast('success', `Dossier "${saved.name}" créé.`);
            logActivity('Ajout', 'Dossiers', `Création du dossier "${saved.name}"`);
        } catch (err) { triggerToast('error', "Erreur."); }
    };

    const handleUpdateCase = async (updated: Case) => {
        try {
            const saved = await apiService.cases.update(updated.id, updated);
            setCases(prev => prev.map(c => c.id === updated.id ? saved : c));
            triggerToast('success', "Dossier mis à jour.");
        } catch (err) { triggerToast('error', "Erreur."); }
    };

    const handleDeleteCase = (id: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Supprimer ce dossier ?',
            message: 'Êtes-vous sûr ?',
            onConfirm: async () => {
                try {
                    await apiService.cases.delete(id);
                    setCases(prev => prev.filter(c => c.id !== id));
                    triggerToast('success', "Supprimé.");
                } catch (err) { triggerToast('error', "Erreur."); }
            }
        });
    };

    const handleAddEvent = async (event: any) => {
        try {
            const saved = await apiService.events.create(event);
            setEvents(prev => [...prev, saved]);
            triggerToast('success', "Événement ajouté.");
        } catch (err) { triggerToast('error', "Erreur."); }
    };

    const handleUpdateEvent = async (updated: Event) => {
        try {
            const saved = await apiService.events.update(updated.id, updated);
            setEvents(prev => prev.map(e => e.id === updated.id ? saved : e));
            triggerToast('success', "Mis à jour.");
        } catch (err) { triggerToast('error', "Erreur."); }
    };

    const handleDeleteEvent = (id: string) => {
        setConfirmModal({
            isOpen: true,
            title: "Supprimer l'événement ?",
            onConfirm: async () => {
                try {
                    await apiService.events.delete(id);
                    setEvents(prev => prev.filter(e => e.id !== id));
                    triggerToast('success', "Supprimé.");
                } catch (err) { triggerToast('error', "Erreur."); }
            },
            message: 'Action irréversible.'
        });
    };

    const handleAddTask = async (task: any) => {
        try {
            const saved = await apiService.tasks.create(task);
            setTasks(prev => [...prev, saved]);
            triggerToast('success', "Tâche ajoutée.");
        } catch (err) { triggerToast('error', "Erreur."); }
    };

    const handleUpdateTask = async (updated: Task) => {
        try {
            const saved = await apiService.tasks.update(updated.id, updated);
            setTasks(prev => prev.map(t => t.id === updated.id ? saved : t));
            triggerToast('success', "Tâche mise à jour.");
        } catch (err) { triggerToast('error', "Erreur."); }
    };

    const handleUpdateTaskStatus = async (id: number, status: any) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;
        try {
            const updated = { ...task, status };
            await apiService.tasks.update(id, updated);
            setTasks(prev => prev.map(t => t.id === id ? updated : t));
        } catch (err) { triggerToast('error', "Erreur."); }
    };

    const handleDeleteTask = (id: number) => {
        setConfirmModal({
            isOpen: true,
            title: "Supprimer la tâche ?",
            message: "Êtes-vous sûr ?",
            onConfirm: async () => {
                try {
                    await apiService.tasks.delete(id);
                    setTasks(prev => prev.filter(t => t.id !== id));
                    triggerToast('success', "Supprimée.");
                } catch (err) { triggerToast('error', "Erreur."); }
            }
        });
    };

    const handleAddInvoice = async (invoice: any) => {
        try {
            const saved = await apiService.invoices.create(invoice);
            setInvoices(prev => [...prev, saved]);
            triggerToast('success', "Facture émise.");
        } catch (err) { triggerToast('error', "Erreur."); }
    };

    const handleUpdateInvoice = async (updated: Invoice) => {
        try {
            const saved = await apiService.invoices.update(updated.id, updated);
            setInvoices(prev => prev.map(i => i.id === updated.id ? saved : i));
            triggerToast('success', "Facture mise à jour.");
        } catch (err) { triggerToast('error', "Erreur."); }
    };

    const handleDeleteInvoice = (id: string) => {
        setConfirmModal({
            isOpen: true,
            title: "Supprimer la facture ?",
            message: "Action définitive.",
            onConfirm: async () => {
                try {
                    await apiService.invoices.delete(id);
                    setInvoices(prev => prev.filter(i => i.id !== id));
                    triggerToast('success', "Supprimée.");
                } catch (err) { triggerToast('error', "Erreur."); }
            }
        });
    };

    const handleAddAvocat = async (avocat: any) => {
        try {
            const saved = await apiService.avocats.create(avocat);
            setAvocats(prev => [...prev, saved]);
            triggerToast('success', "Avocat ajouté.");
        } catch (err) { triggerToast('error', "Erreur."); }
    };

    const handleUpdateAvocat = async (updated: Avocat) => {
        try {
            const saved = await apiService.avocats.update(updated.id, updated);
            setAvocats(prev => prev.map(a => a.id === updated.id ? saved : a));
            triggerToast('success', "Profil mis à jour.");
        } catch (err) { triggerToast('error', "Erreur."); }
    };

    const handleDeleteAvocat = (id: string) => {
        setConfirmModal({
            isOpen: true,
            title: "Retirer l'avocat ?",
            message: "Action définitive.",
            onConfirm: async () => {
                try {
                    await apiService.avocats.delete(id);
                    setAvocats(prev => prev.filter(a => a.id !== id));
                    triggerToast('success', "Retiré.");
                } catch (err) { triggerToast('error', "Erreur."); }
            }
        });
    };

    const handleAddPersonnel = async (p: any) => {
        try {
            const saved = await apiService.personnels.create(p);
            setPersonnels(prev => [...prev, saved]);
            triggerToast('success', "Personnel ajouté.");
        } catch (err) { triggerToast('error', "Erreur."); }
    };

    const handleUpdatePersonnel = async (updated: Personnel) => {
        try {
            const saved = await apiService.personnels.update(updated.id, updated);
            setPersonnels(prev => prev.map(p => p.id === updated.id ? saved : p));
            triggerToast('success', "Personnel mis à jour.");
        } catch (err) { triggerToast('error', "Erreur."); }
    };

    const handleDeletePersonnel = (id: string) => {
        setConfirmModal({
            isOpen: true,
            title: "Retirer le membre ?",
            message: "Action définitive.",
            onConfirm: async () => {
                try {
                    await apiService.personnels.delete(id);
                    setPersonnels(prev => prev.filter(p => p.id !== id));
                    triggerToast('success', "Retiré.");
                } catch (err) { triggerToast('error', "Erreur."); }
            }
        });
    };

    const handleAddFournisseur = async (f: any) => {
        try {
            const saved = await apiService.fournisseurs.create(f);
            setFournisseurs(prev => [...prev, saved]);
            triggerToast('success', "Fournisseur ajouté.");
        } catch (err) { triggerToast('error', "Erreur."); }
    };

    const handleUpdateFournisseur = async (updated: Fournisseur) => {
        try {
            const saved = await apiService.fournisseurs.update(updated.id, updated);
            setFournisseurs(prev => prev.map(f => f.id === updated.id ? saved : f));
            triggerToast('success', "Fournisseur mis à jour.");
        } catch (err) { triggerToast('error', "Erreur."); }
    };

    const handleDeleteFournisseur = (id: string) => {
        setConfirmModal({
            isOpen: true,
            title: "Supprimer le fournisseur ?",
            message: "Action définitive.",
            onConfirm: async () => {
                try {
                    await apiService.fournisseurs.delete(id);
                    setFournisseurs(prev => prev.filter(f => f.id !== id));
                    triggerToast('success', "Supprimé.");
                } catch (err) { triggerToast('error', "Erreur."); }
            }
        });
    };

    const handleLoginSuccess = (email: string) => {
        setIsAuthenticated(true);
        const cleanEmail = email.trim().toLowerCase();

        // Search in avocats
        const foundAvocat = avocats.find(a =>
            a.emails && a.emails.some(e => e.trim().toLowerCase() === cleanEmail)
        );
        if (foundAvocat) {
            const userInfo = {
                name: foundAvocat.fullName,
                role: foundAvocat.cabinetRole || foundAvocat.cabinetStatus || "Avocat",
                email: cleanEmail
            };
            setCurrentUserInfo(userInfo);
            triggerToast('success', `Ravi de vous revoir, Maître ${foundAvocat.fullName} !`);
            return;
        }

        // Search in personnels
        const foundPersonnel = personnels.find(p =>
            p.email && p.email.trim().toLowerCase() === cleanEmail
        );
        if (foundPersonnel) {
            const userInfo = {
                name: foundPersonnel.fullName,
                role: foundPersonnel.role,
                email: cleanEmail
            };
            setCurrentUserInfo(userInfo);
            triggerToast('success', `Ravi de vous revoir, ${foundPersonnel.fullName} !`);
            return;
        }

        // Default admin account
        const adminName = cleanEmail === 'jeremieshusu4@gmail.com' ? "Jérémie Shusu" : "Administrateur Cabinet";
        const adminInfo = {
            name: adminName,
            role: "Directeur Associé KBB",
            email: cleanEmail
        };
        setCurrentUserInfo(adminInfo);
        triggerToast('success', `Connexion réussie !`);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentUserInfo(null);
        setCurrentPage('Dashboard');
    };

    const lawyerNames = avocats.map((a) => a.fullName);

    const renderPage = () => {
        const pageProps = {
            clients, cases, events, tasks, invoices, avocats, lawyerNames, personnels, fournisseurs,
            onAddClient: handleAddClient, onAddCase: handleAddCase, onAddEvent: handleAddEvent,
            onAddTask: handleAddTask, onAddInvoice: handleAddInvoice, onAddAvocat: handleAddAvocat, onAddPersonnel: handleAddPersonnel, onAddFournisseur: handleAddFournisseur,
            onDeleteClient: handleDeleteClient, onDeleteCase: handleDeleteCase, onDeleteAvocat: handleDeleteAvocat, onDeletePersonnel: handleDeletePersonnel, onDeleteFournisseur: handleDeleteFournisseur,
            onDeleteEvent: handleDeleteEvent, onDeleteTask: handleDeleteTask, onDeleteInvoice: handleDeleteInvoice,
            onUpdateClient: handleUpdateClient, onUpdateCase: handleUpdateCase, onUpdateAvocat: handleUpdateAvocat, onUpdatePersonnel: handleUpdatePersonnel, onUpdateEvent: handleUpdateEvent, onUpdateTask: handleUpdateTask, onUpdateInvoice: handleUpdateInvoice, onUpdateFournisseur: handleUpdateFournisseur,
            onSendEmail: triggerEmail,
        };

        switch (currentPage) {
            case 'Dashboard': return <DashboardPage clients={clients} cases={cases} events={events} tasks={tasks} invoices={invoices} avocats={avocats} onUpdateTaskStatus={handleUpdateTaskStatus} onAddTask={handleAddTask} />;
            case 'Clients': return <ClientsPage clients={clients} cases={cases} invoices={invoices} tasks={tasks} onAddClient={handleAddClient} onSendEmail={triggerEmail} />;
            case 'Dossiers': return <CasesPage cases={cases} clients={clients} tasks={tasks} invoices={invoices} onAddCase={handleAddCase} avocats={avocats} onSendEmail={triggerEmail} onNavigate={setCurrentPage} />;
            case 'Procedures': return <ProceduresPage cases={cases} onUpdateCase={handleUpdateCase} searchQuery={''} setSearchQuery={() => {}} />;
            case 'Evenements': return <EventsPage events={events} onAddEvent={handleAddEvent} onUpdateEvent={handleUpdateEvent} avocats={avocats} personnels={personnels} onSendEmail={triggerEmail} />;
            case 'Agenda': return <AgendaPage tasks={tasks} cases={cases} lawyers={lawyerNames} avocats={avocats} onAddTask={handleAddTask} onUpdateTask={handleUpdateTask} events={events} onSendEmail={triggerEmail} />;
            case 'Chat': return <ChatPage avocats={avocats} personnels={personnels} currentUserInfo={currentUserInfo} presences={presences} />;
            case 'Correspondance': return <CorrespondancePage clients={clients} cases={cases} avocats={avocats} onSendEmail={triggerEmail} currentUserInfo={currentUserInfo} />;
            case 'Facturation': return <BillingPage invoices={invoices} cases={cases} onAddInvoice={handleAddInvoice} onSendEmail={triggerEmail} clients={clients} />;
            case 'Avocats': return <AvocatsPage avocats={avocats} tasks={tasks} onAddAvocat={handleAddAvocat} onSendEmail={triggerEmail} correspondances={correspondances} />;
            case 'Personnels': return <PersonnelsPage personnels={personnels} onAddPersonnel={handleAddPersonnel} onDeletePersonnel={handleDeletePersonnel} onSendEmail={triggerEmail} />;
            case 'Fournisseurs': return <FournisseursPage fournisseurs={fournisseurs} onAddFournisseur={handleAddFournisseur} onDeleteFournisseur={handleDeleteFournisseur} onSendEmail={triggerEmail} />;
            case 'Gestion': return <GestionPage {...pageProps} currentUser={currentUserObj} onSendEmail={triggerEmail} onAddToast={triggerToast} />;
            case 'AuditLogs': return <AuditLogsPage logs={logs} />;
            case 'AIAssistant': return <AIAssistantPage clients={clients} cases={cases} tasks={tasks} invoices={invoices} />;
            default: return <DashboardPage clients={clients} cases={cases} events={events} tasks={tasks} invoices={invoices} avocats={avocats} onUpdateTaskStatus={handleUpdateTaskStatus} onAddTask={handleAddTask} />;
        }
    };

    if (!isAuthenticated) return <LoginPage onLoginSuccess={handleLoginSuccess} />;

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-[#070b13] font-sans overflow-hidden transition-colors duration-300">
            <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={handleLogout} currentUserInfo={currentUserInfo} currentUser={currentUserObj} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header 
                    searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                    clients={clients} cases={cases} events={events}
                    setCurrentPage={setCurrentPage} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}
                    currentUserInfo={currentUserInfo} onLogout={handleLogout} onMenuToggle={() => setIsSidebarOpen(true)}
                    isDbConnected={isDbConnected}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar relative">
                    {!isSyncComplete ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#15447c]"></div>
                        </div>
                    ) : renderPage()}
                </main>
            </div>

            {/* Toasts & Modals */}
            <div className="fixed bottom-5 right-5 space-y-3 z-50">
                <AnimatePresence>
                    {toasts.map((t) => (
                        <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`p-4 rounded-xl text-white shadow-lg ${t.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                            {t.text}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {confirmModal.isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white p-6 rounded-2xl max-w-sm w-full">
                            <h3 className="text-lg font-bold mb-2">{confirmModal.title}</h3>
                            <p className="text-sm text-gray-500 mb-6">{confirmModal.message}</p>
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} className="px-4 py-2 text-sm">Annuler</button>
                                <button onClick={() => { confirmModal.onConfirm(); setConfirmModal(prev => ({ ...prev, isOpen: false })); }} className="px-4 py-2 text-sm bg-rose-600 text-white rounded-lg">Confirmer</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            
            <EmailComposerModal isOpen={emailConfig.isOpen} onClose={() => setEmailConfig(prev => ({ ...prev, isOpen: false }))} defaultTo={emailConfig.to} defaultSubject={emailConfig.subject} defaultBody={emailConfig.body} />
        </div>
    );
}

export default App;
