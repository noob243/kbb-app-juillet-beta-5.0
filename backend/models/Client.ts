import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
  id: string | number;
  name: string;
  denomination?: string;
  contact: string;
  cases: number;
  email?: string;
  phone?: string;
  secteur?: string;
  siege?: string;
  sieges?: string[];
  dirigeant?: string;
  ref1_nom?: string;
  ref1_phone?: string;
  ref1_email?: string;
  ref2_nom?: string;
  ref2_phone?: string;
  ref2_email?: string;
  typeFacturation?: string;
  logoUrl?: string;
  piecesJointes?: Array<{ name: string; size: string; content?: string }>;
}

const clientSchema: Schema = new Schema({
  id: { type: Schema.Types.Mixed, required: true, unique: true },
  name: { type: String, required: true },
  denomination: String,
  contact: { type: String, required: true },
  cases: { type: Number, default: 0 },
  email: String,
  phone: String,
  secteur: String,
  siege: String,
  sieges: [String],
  dirigeant: String,
  ref1_nom: String,
  ref1_phone: String,
  ref1_email: String,
  ref2_nom: String,
  ref2_phone: String,
  ref2_email: String,
  typeFacturation: String,
  logoUrl: String,
  piecesJointes: [{
    name: String,
    size: String,
    content: String
  }]
}, { timestamps: true });

export default mongoose.model<IClient>('Client', clientSchema);
