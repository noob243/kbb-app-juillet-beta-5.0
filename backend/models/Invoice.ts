import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoice extends Document {
  id: string;
  caseId: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  status: 'Réglée' | 'Non réglée' | 'En cours';
  etiquette?: string;
  piecesJointes?: Array<{ name: string; size: string; content?: string }>;
}

const invoiceSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  caseId: { type: String, required: true },
  dueDate: { type: String, required: true },
  totalAmount: { type: Number, required: true, default: 0 },
  paidAmount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['Réglée', 'Non réglée', 'En cours'],
    default: 'Non réglée'
  },
  etiquette: String,
  piecesJointes: [{ name: String, size: String, content: String }]
}, { timestamps: true });

export default mongoose.model<IInvoice>('Invoice', invoiceSchema);
