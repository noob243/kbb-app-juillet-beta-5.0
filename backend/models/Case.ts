import mongoose, { Schema, Document } from 'mongoose';

export interface ICase extends Document {
  id: string;
  name: string;
  client: string;
  status: 'Nouveau' | 'En cours' | 'En attente' | 'Clôturé';
  nextHearing: string | null;
  procedure?: string;
  procedureInstance?: string;
  procedureObjet?: string;
  procedureDateDebut?: string;
  procedureDateFin?: string;
  procedureStatus?: string;
  notes?: string;
  procedures?: any[];
  avocatTitulaire?: string;
  avocatsSurDossier?: string;
  tags?: string[];
  adversaire?: string;
  adversaires?: string[];
  piecesJointes?: Array<{ name: string; size: string; content?: string }>;
}

const caseSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  client: { type: String, required: true },
  status: {
    type: String,
    enum: ['Nouveau', 'En cours', 'En attente', 'Clôturé'],
    default: 'Nouveau'
  },
  nextHearing: { type: String, default: null },
  procedure: String,
  procedureInstance: String,
  procedureObjet: String,
  procedureDateDebut: String,
  procedureDateFin: String,
  procedureStatus: String,
  notes: String,
  procedures: [{
    id: String,
    name: String,
    instance: String,
    objet: String,
    dateDebut: String,
    dateFin: String,
    status: String,
    linkedCases: [String]
  }],
  avocatTitulaire: String,
  avocatsSurDossier: String,
  tags: [String],
  adversaire: String,
  adversaires: [String],
  piecesJointes: [{
    name: String,
    size: String,
    content: String
  }]
}, { timestamps: true });

export default mongoose.model<ICase>('Case', caseSchema);
