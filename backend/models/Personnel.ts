import mongoose, { Schema, Document } from 'mongoose';

export interface IPersonnel extends Document {
  id: string;
  fullName: string;
  role: string;
  category?: 'Administratif' | 'Office';
  hasAppAccess?: boolean;
  isDeleted?: boolean;
  email: string;
  phone: string;
  serviceStartDate: string;
  serviceStatus: 'Actif' | 'Inactif' | 'Mise en disponibilité';
  salary: number;
  maritalStatus: 'Célibataire' | 'Marié(e)' | 'Divorcé(e)' | 'Veuf(ve)';
  hasChildren: 'Oui' | 'Non';
  childrenCount?: number;
  address: string;
  photo?: string;
  disciplinaryMeasure?: string;
  disciplinaryStatus?: string;
  bankAccounts?: any[];
  piecesJointes?: any[];
}

const personnelSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  role: { type: String, required: true },
  category: { type: String, enum: ['Administratif', 'Office'] },
  hasAppAccess: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  serviceStartDate: { type: String, required: true },
  serviceStatus: { type: String, enum: ['Actif', 'Inactif', 'Mise en disponibilité'], default: 'Actif' },
  salary: { type: Number, default: 0 },
  maritalStatus: { type: String, enum: ['Célibataire', 'Marié(e)', 'Divorcé(e)', 'Veuf(ve)'] },
  hasChildren: { type: String, enum: ['Oui', 'Non'] },
  childrenCount: { type: Number, default: 0 },
  address: String,
  photo: String,
  disciplinaryMeasure: String,
  disciplinaryStatus: String,
  bankAccounts: [{ bankName: String, accountNumber: String, iban: String, swift: String }],
  piecesJointes: [{ name: String, size: String, content: String }]
}, { timestamps: true });

export default mongoose.model<IPersonnel>('Personnel', personnelSchema);
