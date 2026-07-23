import mongoose, { Schema, Document } from 'mongoose';

export interface IFournisseur extends Document {
  id: string;
  nomComplet: string;
  logo?: string;
  naturePrestation: 'Bien' | 'Services' | 'Baie locative';
  designationPrestation: string;
  typeFacturation: 'Périodique' | 'Ponctuelle';
  periode?: 'mensuel' | 'trimestriel' | 'Annuel';
  montant: number;
  adressePhysique: string;
  adresseMail: string;
  dirigeantPrincipal: string;
  referents: any[];
  piecesJointes?: any[];
}

const fournisseurSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  nomComplet: { type: String, required: true },
  logo: String,
  naturePrestation: { type: String, enum: ['Bien', 'Services', 'Baie locative'], required: true },
  designationPrestation: { type: String, required: true },
  typeFacturation: { type: String, enum: ['Périodique', 'Ponctuelle'], required: true },
  periode: { type: String, enum: ['mensuel', 'trimestriel', 'Annuel'] },
  montant: { type: Number, default: 0 },
  adressePhysique: String,
  adresseMail: String,
  dirigeantPrincipal: String,
  referents: [{ nom: String, phone: String, email: String }],
  piecesJointes: [{ name: String, size: String, content: String }]
}, { timestamps: true });

export default mongoose.model<IFournisseur>('Fournisseur', fournisseurSchema);
