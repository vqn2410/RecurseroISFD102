import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDFReqCqEqbXCVmHWc5nX4wVyPCkYUV-gM",
    authDomain: "recursero-470d1.firebaseapp.com",
    projectId: "recursero-470d1",
    storageBucket: "recursero-470d1.appspot.com", // 👈 corregido
    messagingSenderId: "411275061691",
    appId: "1:411275061691:web:67a7367c84a5b21cb87c9e",
    measurementId: "G-D7VZZKEB1Z"
};

export const isFirebaseConfigured = !!firebaseConfig.apiKey;

let app;
try {
    if (isFirebaseConfigured) {
        app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    } else {
        console.error("⚠️ ERROR CRÍTICO: La API Key de Firebase está vacía.");
    }
} catch (error) {
    console.error("Error inicializando Firebase:", error);
}

// Export Firebase instances
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;
export const analytics = app ? getAnalytics(app) : null;

//