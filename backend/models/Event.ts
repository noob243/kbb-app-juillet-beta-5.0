import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  id: string;
  name: string;
  type: 'Atelier' | 'Conférence' | 'Colloque' | 'Séminaire' | 'Autre';
  date: string;
  dates?: string[];
  lieu: string;
  partenaires?: string;
  coOrganisateur?: string;
  publicCible?: string;
  membresKBB?: string;
  membresExternes?: string;
  budgetPrevisionnel?: string;
  budgetRealise?: string;
  fraisParticipation?: number;
  autresRecettes?: number;
  recettesTotal?: number;
  financement?: string;
  financements?: Array<{ label: string; amount: string }>;
  sponsors?: string;
  photoProfil?: string;
  piecesJointes?: Array<{ name: string; size: string; content?: string }>;
  reports?: any[];
  evolutionFinancement?: Array<{ designation: string; attendu: number; realise: number }>;
}

const eventSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['Atelier', 'Conférence', 'Colloque', 'Séminaire', 'Autre'],
    default: 'Autre'
  },
  date: { type: String, required: true },
  dates: [String],
  lieu: { type: String, required: true },
  partenaires: String,
  coOrganisateur: String,
  publicCible: String,
  membresKBB: String,
  membresExternes: String,
  budgetPrevisionnel: String,
  budgetRealise: String,
  fraisParticipation: { type: Number, default: 0 },
  autresRecettes: { type: Number, default: 0 },
  recettesTotal: { type: Number, default: 0 },
  financement: String,
  financements: [{ label: String, amount: String }],
  sponsors: String,
  photoProfil: String,
  piecesJointes: [{ name: String, size: String, content: String }],
  reports: [{
    id: String,
    title: String,
    content: String,
    dateCreated: String,
    author: String,
    files: [{ name: String, size: String, content: String }]
  }],
  evolutionFinancement: [{ designation: String, attendu: Number, realise: Number }]
}, { timestamps: true });

export default mongoose.model<IEvent>('Event', eventSchema);
