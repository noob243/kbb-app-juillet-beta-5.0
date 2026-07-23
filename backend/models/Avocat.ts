import mongoose, { Schema, Document } from 'mongoose';

export interface IAvocat extends Document {
  id: string;
  fullName: string;
  photoUrl?: string;
  firstOathDate: string;
  secondOathDate: string;
  onaNumber: string;
  cabinetStatus: 'Senior of counsel' | 'Senior' | 'Associé' | 'Junior';
  serviceStartDate: string;
  serviceStatus: 'Actif' | 'Omis' | 'Mise en disponibilité';
  cabinetRole: string;
  phone: string;
  emails: string[];
  disciplinaryMeasures: string;
  mainBar?: string;
  secondaryBar?: string;
  barreaux?: string[];
  maritalStatus?: string;
  physicalAddress?: string;
  hasChildren?: string;
  childrenCount?: number;
  bankAccounts?: any[];
  piecesJointes?: Array<{ name: string; size: string; content?: string }>;
}

const avocatSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  photoUrl: String,
  firstOathDate: { type: String, required: true },
  secondOathDate: { type: String, required: true },
  onaNumber: { type: String, required: true },
  cabinetStatus: {
    type: String,
    enum: ['Senior of counsel', 'Senior', 'Associé', 'Junior'],
    required: true
  },
  serviceStartDate: { type: String, required: true },
  serviceStatus: {
    type: String,
    enum: ['Actif', 'Omis', 'Mise en disponibilité'],
    default: 'Actif'
  },
  cabinetRole: { type: String, required: true },
  phone: { type: String, required: true },
  emails: [{ type: String, required: true }],
  disciplinaryMeasures: String,
  mainBar: String,
  secondaryBar: String,
  barreaux: [String],
  maritalStatus: String,
  physicalAddress: String,
  hasChildren: String,
  childrenCount: { type: Number, default: 0 },
  bankAccounts: [{
    bankName: String,
    accountNumber: String,
    iban: String,
    swift: String
  }],
  piecesJointes: [{ name: String, size: String, content: String }]
}, { timestamps: true });

export default mongoose.model<IAvocat>('Avocat', avocatSchema);
