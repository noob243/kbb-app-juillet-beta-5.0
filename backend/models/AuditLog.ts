import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  id: string;
  timestamp: string;
  userEmail: string;
  userName: string;
  actionType: 'Ajout' | 'Modification' | 'Suppression' | 'Connexion' | 'Autre';
  module: string;
  description: string;
  details?: any;
}

const auditLogSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  timestamp: { type: String, required: true },
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  actionType: { type: String, enum: ['Ajout', 'Modification', 'Suppression', 'Connexion', 'Autre'], required: true },
  module: { type: String, required: true },
  description: { type: String, required: true },
  details: Schema.Types.Mixed
}, { timestamps: true });

export default mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
