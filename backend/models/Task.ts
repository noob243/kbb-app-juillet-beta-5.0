import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  id: number;
  name: string;
  caseId: string;
  lawyer: string;
  dueDate: string;
  status: 'Effectué' | 'Non effectué' | 'Effectué à moitié';
  notes?: string;
  procedureLinked?: string;
  procedureLinkedIds?: string[];
  startDate?: string;
  endDate?: string;
  associatedLawyers?: string[];
  rapport?: string;
  reminderEnabled?: boolean;
  reminderDate?: string;
  reminderTime?: string;
  reminderSound?: 'digital' | 'bell' | 'marimba' | 'classic';
  reminderTriggered?: boolean;
  attachments?: Array<{ name: string; size: string; content?: string }>;
}

const taskSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  caseId: { type: String, required: true },
  lawyer: { type: String, required: true },
  dueDate: { type: String, required: true },
  status: {
    type: String,
    enum: ['Effectué', 'Non effectué', 'Effectué à moitié'],
    default: 'Non effectué'
  },
  notes: String,
  procedureLinked: String,
  procedureLinkedIds: [String],
  startDate: String,
  endDate: String,
  associatedLawyers: [String],
  rapport: String,
  reminderEnabled: { type: Boolean, default: false },
  reminderDate: String,
  reminderTime: String,
  reminderSound: {
    type: String,
    enum: ['digital', 'bell', 'marimba', 'classic'],
    default: 'digital'
  },
  reminderTriggered: { type: Boolean, default: false },
  attachments: [{ name: String, size: String, content: String }]
}, { timestamps: true });

export default mongoose.model<ITask>('Task', taskSchema);
