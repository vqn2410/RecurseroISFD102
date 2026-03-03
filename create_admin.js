import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDFReqCqEqbXCVmHWc5nX4wVyPCkYUV-gM",
    authDomain: "recursero-470d1.firebaseapp.com",
    projectId: "recursero-470d1",
    storageBucket: "recursero-470d1.firebasestorage.app",
    messagingSenderId: "411275061691",
    appId: "1:411275061691:web:67a7367c84a5b21cb87c9e",
    measurementId: "G-D7VZZKEB1Z"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function addAdmin() {
    const email = "nvergara@abc.gob.ar";
    const defaultPassword = "password123";
    let uid = null;

    try {
        console.log("Intentando crear usuario en Firebase Auth...");
        const userCredential = await createUserWithEmailAndPassword(auth, email, defaultPassword);
        uid = userCredential.user.uid;
        console.log("Usuario creado con éxito. UID:", uid);
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            console.log("El usuario ya existe en Auth. Iniciando sesión temporal para obtener UID...");
            try {
                // If the user already exists and we need their UID without admin SDK,
                // we have to be able to sign in, but we might not know their password.
                // However, if the user already exists in Firestore we could just query by email?
                const q = await import("firebase/firestore").then(m => m.query(m.collection(db, "users"), m.where("email", "==", email)));
                const snapshot = await import("firebase/firestore").then(m => m.getDocs(q));
                if (!snapshot.empty) {
                    uid = snapshot.docs[0].id;
                    console.log("Usuario encontrado en Firestore con UID:", uid);
                } else {
                    console.log("No se pudo obtener el UID. Recomendación: Crea el usuario manualmente o actualiza por su ID conocido.");
                    process.exit(1);
                }
            } catch (e) {
                console.error("Error intentando recuperar el usuario:", e);
                process.exit(1);
            }
        } else {
            console.error("Error creando usuario:", error);
            process.exit(1);
        }
    }

    if (uid) {
        console.log("Escribiendo permisos en Firestore para", uid);
        await setDoc(doc(db, "users", uid), {
            uid: uid,
            email: email,
            nombreCompleto: "N Vergara",
            rol: "administrador",
            firstLogin: true,
            fechaCreacion: serverTimestamp()
        }, { merge: true });
        console.log("Éxito. Permisos otorgados.");
    }

    process.exit(0);
}

addAdmin().catch(console.error);
