import mongoose, { Schema, Document } from 'mongoose';

export interface ICorrespondance extends Document {
  id: string;
  date: string;
  type?: 'Lettre' | 'E-mail' | 'Mise en demeure' | 'Autre';
  recipientName: string;
  destinataire?: string;
  recipientEmail?: string;
  subject: string;
  content: string;
  status: 'Brouillon' | 'Envoyé' | 'Reçu';
  author: string;
  caseId?: string;
  procedureId?: string;
  avocatSignataireId?: string;
  dateEmission?: string;
  dateReception?: string;
  piecesJointes?: any[];
}

const correspondanceSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  type: { type: String, enum: ['Lettre', 'E-mail', 'Mise en demeure', 'Autre'] },
  recipientName: { type: String, required: true },
  destinataire: String,
  recipientEmail: String,
  subject: { type: String, required: true },
  content: { type: String, required: true },
  status: { type: String, enum: ['Brouillon', 'Envoyé', 'Reçu'], default: 'Brouillon' },
  author: { type: String, required: true },
  caseId: String,
  procedureId: String,
  avocatSignataireId: String,
  dateEmission: String,
  dateReception: String,
  piecesJointes: [{ name: String, size: String, content: String }]
}, { timestamps: true });

export default mongoose.model<ICorrespondance>('Correspondance', correspondanceSchema);
