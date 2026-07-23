import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  sender: string;
  content: string;
  timestamp: Date;
  recipient?: string;
  channel?: string;
  isRead: boolean;
}

const messageSchema: Schema = new Schema({
  sender: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  recipient: String,
  channel: String,
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<IMessage>('Message', messageSchema);
