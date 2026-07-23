import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Client from './models/Client';
import Case from './models/Case';
import Event from './models/Event';
import Task from './models/Task';
import Invoice from './models/Invoice';
import Avocat from './models/Avocat';
import Personnel from './models/Personnel';
import Fournisseur from './models/Fournisseur';
import AuditLog from './models/AuditLog';
import Correspondance from './models/Correspondance';

dotenv.config();

const initialClients = [
  { id: 1, name: "Congo Invest SARL", contact: "M. Mbaku", cases: 2, email: "contact@congo-invest.cd", phone: "+243 810 000 100", typeFacturation: "Abonnement mensuel" },
  { id: 2, name: "Banque Centrale du Congo", contact: "Dpt Juridique", cases: 5, email: "juridique@bcc.cd", phone: "+243 810 000 200", typeFacturation: "Taux horaire" }
];

const initialCases = [
  { id: "CI-2024-001", name: "Contentieux Foncier - Limete", client: "Congo Invest SARL", status: "En cours", nextHearing: "2024-08-15", procedure: "Tribunal de Grande Instance", procedureStatus: "En cours" },
  { id: "BCC-2024-012", name: "Recouvrement Créance Interne", client: "Banque Centrale du Congo", status: "En attente", nextHearing: null, procedure: "Arbitrage", procedureStatus: "En attente" }
];

const initialEvents = [
  { id: "EVT-001", name: "Audience CI vs État", type: "Autre", date: "2024-08-15", lieu: "Palais de Justice, Gombe" }
];

const initialAvocats = [
  {
    id: "AV-001",
    fullName: "Jean-Luc Tshisekedi",
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

const initialTasks = [
  { id: 1, name: "Rédiger conclusions CI", caseId: "CI-2024-001", lawyer: "Jean-Luc Tshisekedi", dueDate: "2024-08-10", status: "Non effectué" }
];

const initialInvoices = [
  { id: "FACT-2024-001", caseId: "CI-2024-001", dueDate: "2024-08-30", totalAmount: 1500, paidAmount: 500, status: "En cours" }
];

const initialPersonnels = [
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

const initialFournisseurs = [
  { id: "FRN-001", nomComplet: "Imprimerie Rapide", naturePrestation: "Services", designationPrestation: "Fournitures bureau", typeFacturation: "Ponctuelle", montant: 250, adressePhysique: "Gombe", adresseMail: "contact@imprimerie.cd", dirigeantPrincipal: "M. Paul", referents: [] }
];

const initialCorrespondances = [
  { id: "CORR-001", date: "2024-07-23", type: "Lettre", recipientName: "Congo Invest", subject: "Mise en demeure", content: "Veuillez payer vos factures.", status: "Brouillon", author: "Jean-Luc Tshisekedi" }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error("MONGODB_URI is not defined");

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await Promise.all([
      Client.deleteMany({}),
      Case.deleteMany({}),
      Event.deleteMany({}),
      Task.deleteMany({}),
      Invoice.deleteMany({}),
      Avocat.deleteMany({}),
      Personnel.deleteMany({}),
      Fournisseur.deleteMany({}),
      AuditLog.deleteMany({}),
      Correspondance.deleteMany({})
    ]);

    // Insert new data
    await Promise.all([
      Client.insertMany(initialClients),
      Case.insertMany(initialCases),
      Event.insertMany(initialEvents),
      Task.insertMany(initialTasks),
      Invoice.insertMany(initialInvoices),
      Avocat.insertMany(initialAvocats),
      Personnel.insertMany(initialPersonnels),
      Fournisseur.insertMany(initialFournisseurs),
      Correspondance.insertMany(initialCorrespondances)
    ]);

    console.log("✅ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();
