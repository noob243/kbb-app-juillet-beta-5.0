import mongoose from 'mongoose';

let isConnected = false;

export const connectToDatabase = async () => {
  if (isConnected) return;

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI manquant dans les variables d\'environnement');
  }

  const db = await mongoose.connect(process.env.MONGODB_URI);
  isConnected = db.connections[0].readyState === 1;
  console.log('Connecté à MongoDB Atlas');
};