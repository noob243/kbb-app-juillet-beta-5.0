import { Client, Case, Event, Avocat, Task, Invoice, Personnel, Fournisseur } from '../types';

export const initialClients: Client[] = [
  { id: 1, name: "Congo Invest SARL", contact: "M. Mbaku", cases: 2, email: "contact@congo-invest.cd", phone: "+243 810 000 100", typeFacturation: "Abonnement mensuel" },
  { id: 2, name: "Banque Centrale du Congo", contact: "Dpt Juridique", cases: 5, email: "juridique@bcc.cd", phone: "+243 810 000 200", typeFacturation: "Taux horaire" }
];

export const initialCases: Case[] = [
  { id: "CI-2024-001", name: "Contentieux Foncier - Limete", client: "Congo Invest SARL", status: "En cours", nextHearing: "2024-08-15", procedure: "Tribunal de Grande Instance", procedureStatus: "En cours" },
  { id: "BCC-2024-012", name: "Recouvrement Créance Interne", client: "Banque Centrale du Congo", status: "En attente", nextHearing: null, procedure: "Arbitrage", procedureStatus: "En attente" }
];

export const initialEvents: Event[] = [
  { id: "EVT-001", name: "Audience CI vs État", type: "Autre", date: "2024-08-15", lieu: "Palais de Justice, Gombe" }
];

export const initialAvocats: Avocat[] = [
  {
    id: "AV-001",
    fullName: "Jean-Luc Tshisekedi",
    photo: null,
    firstOathDate: "2010-05-12",
    secondOathDate: "2015-06-20",
    onaNumber: "ONA/1234/2010",
    cabinetStatus: "Associé",
    serviceStartDate: "2020-01-01",
    serviceStatus: "Actif",
    cabinetRole: "Directeur de Département",
    phone: "+243 810 000 001",
    emails: ["jl.tshisekedi@cabinet.com"],
    disciplinaryMeasures: ""
  }
];

export const initialTasks: Task[] = [
  { id: 1, name: "Rédiger conclusions CI", caseId: "CI-2024-001", lawyer: "Jean-Luc Tshisekedi", dueDate: "2024-08-10", status: "Non effectué" }
];

export const mockPersonnel: { name: string; role: string; status: string }[] = [
  { name: "Francine Kanku", role: "Secrétaire", status: "online" },
  { name: "David Mbenga", role: "Chauffeur", status: "offline" }
];

export const initialConversations: { [key: string]: { sender: string; text: string; time: string }[] } = {
  "Francine Kanku": [
    { sender: "them", text: "Bonjour Maître, les dossiers sont prêts.", time: "09:00" }
  ]
};

export const initialInvoices: Invoice[] = [
  { id: "FACT-2024-001", caseId: "CI-2024-001", dueDate: "2024-08-30", totalAmount: 1500, paidAmount: 500, status: "En cours" }
];

export const initialPersonnels: Personnel[] = [
  {
    id: "STF-001",
    fullName: "Francine Kanku",
    role: "Secrétaire",
    email: "f.kanku@cabinet.com",
    phone: "+243 810 777 888",
    serviceStartDate: "2022-02-10",
    serviceStatus: "Actif",
    salary: 800,
    maritalStatus: "Célibataire",
    hasChildren: "Non",
    address: "Kinshasa, Ngaliema"
  }
];

export const initialFournisseurs: Fournisseur[] = [
  { id: "FRN-001", nomComplet: "Imprimerie Rapide", naturePrestation: "Services", designationPrestation: "Fournitures bureau", typeFacturation: "Ponctuelle", montant: 250, adressePhysique: "Gombe", adresseMail: "contact@imprimerie.cd", dirigeantPrincipal: "M. Paul", referents: [] }
];

export const initialCorrespondances: Correspondance[] = [
  { id: "CORR-001", date: "2024-07-23", type: "Lettre", recipientName: "Congo Invest", subject: "Mise en demeure", content: "Veuillez payer vos factures.", status: "Brouillon", author: "Jean-Luc Tshisekedi" }
];
