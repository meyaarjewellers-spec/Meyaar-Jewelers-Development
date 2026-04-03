import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
// Replace these values with your Firebase project credentials
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate that all required config values are present
const isConfigValid = !!(firebaseConfig.apiKey && firebaseConfig.projectId);

if (!isConfigValid) {
  console.warn('⚠️ Firebase configuration incomplete. Check your .env.local file.');
  console.warn('Missing:', {
    apiKey: !firebaseConfig.apiKey ? 'VITE_FIREBASE_API_KEY' : 'OK',
    projectId: !firebaseConfig.projectId ? 'VITE_FIREBASE_PROJECT_ID' : 'OK',
  });
  console.warn('📝 Update .env.local with valid Firebase credentials to use authentication features.');
}

let app: any;
let auth: any;
let db: any;
let storage: any;

try {
  // Initialize Firebase (wrapped in try-catch for graceful failure)
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error: any) {
  console.warn('⚠️ Firebase initialization error:', error.message);
  console.warn('The website will still work, but authentication and data storage features will be limited.');
}

export { app, auth, db, storage };
