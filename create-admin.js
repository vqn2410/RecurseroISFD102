/* global process */
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import dotenv from 'dotenv';

// Cargar variables de entorno del archivo .env
dotenv.config();

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdmin() {
    const email = "nvergara@abc.gob.ar";
    const password = "Cambia2410@";

    try {
        console.log("=========================================");
        console.log("Intentando crear usuario en Firebase Auth...");

        // Si da un error porque las variables vacías son falsas, es probable que no esté leyendo tu API key.
        if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes('DummyKey')) {
            console.log("⚠️ ATENCIÓN: Todavía estás usando credenciales de prueba en tu archivo '.env'.");
            console.log("Por favor reemplázalas con tus datos oficiales de Firebase Console y vuelve a intentarlo.");
            console.log("=========================================");
            process.exit(1);
        }

        const { user } = await createUserWithEmailAndPassword(auth, email, password);

        console.log(`✅ Usuario creado correctamente: ${user.uid}`);
        console.log("Asignando el rol de administrador en Firestore...");

        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            nombreCompleto: "Nicolás Vergara",
            rol: "administrador",
            firstLogin: true,
            fechaCreacion: new Date()
        });

        console.log("✅ Permisos de Base de datos asignados al administrador exitosamente.");
        console.log("🚀 Puedes iniciar sesión en la URL en el panel '/login'");
        console.log("=========================================");

        process.exit(0);
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            console.log("⚠️ El usuario 'nvergara@abc.gob.ar' ya existe en Firebase.");
            console.log("Si quieres reiniciarlo, primero debes borrarlo desde la Consola de Authentication de Firebase.");
        } else {
            console.error("❌ Ocurrió un error:", error.message);
        }
        process.exit(1);
    }
}

createAdmin();
