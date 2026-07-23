import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  id: string;
  email: string;
  fullName: string;
  role: string;
  userType: string;
  personnelCategory?: string;
  functionRole?: string;
  hasAppAccess: boolean;
  permissions: string[];
  status: string;
  isDeleted: boolean;
  phone?: string;
  linkedEntityId?: string;
  createdAt: string;
  updatedAt: string;
}

const userSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  fullName: { type: String, required: true },
  role: { type: String, required: true },
  userType: { type: String, required: true },
  personnelCategory: String,
  functionRole: String,
  hasAppAccess: { type: Boolean, default: true },
  permissions: [String],
  status: { type: String, default: 'Actif' },
  isDeleted: { type: Boolean, default: false },
  phone: String,
  linkedEntityId: String,
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<IUser>('User', userSchema);
