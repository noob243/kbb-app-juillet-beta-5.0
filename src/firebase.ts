import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfigJson from '../firebase-applet-config.json';

const config = firebaseConfigJson || {};

const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || config.projectId || "app-data-base-kbb-2026",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || config.appId || "1:316612502367:web:6175cdddbba834aca5ccea",
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || config.apiKey || "AIzaSyBjNHsojvR4gP9EqTqIvp3OGJZIpiYm2YU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || config.authDomain || "app-data-base-kbb-2026.firebaseapp.com",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || config.storageBucket || "app-data-base-kbb-2026.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || config.messagingSenderId || "316612502367",
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || config.firestoreDatabaseId || "(default)",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

console.log("Firebase App Initialized:", app.name);
console.log("Firestore Project ID:", firebaseConfig.projectId);

export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)' 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

console.log("Firestore Database Instance assigned.");
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

export { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup };


