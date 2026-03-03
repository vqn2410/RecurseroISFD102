import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Debug helper para Vercel (aviso en consola si faltan variables)
export const isFirebaseConfigured = !!firebaseConfig.apiKey;

let app;
try {
    if (isFirebaseConfigured) {
        app = initializeApp(firebaseConfig);
    } else {
        console.error("⚠️ ERROR CRÍTICO: La API Key de Firebase está vacía. Faltan variables de entorno.");
    }
} catch (error) {
    console.error("Error inicializando Firebase:", error);
}

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;
export const analytics = app ? getAnalytics(app) : null;
