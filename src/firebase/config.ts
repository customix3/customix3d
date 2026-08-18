import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

/**
 * Firebase project: customix3d-123
 * Prefer VITE_* env vars; hardcoded fallback for local builds.
 * Security is enforced by Firestore & Storage rules (not by hiding the web API key).
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyChbLoLojYdk7ypdEcCDUkL2yyTHPsVBCM',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'customix3d-123.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'customix3d-123',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'customix3d-123.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '369969895183',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:369969895183:web:3c7e147a4027352f06107a',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.apiKey !== 'demo-key' &&
    firebaseConfig.projectId !== 'demo-project'
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (isFirebaseConfigured) {
  app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

export { app, auth, db, storage };
export default app;
