import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

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

async function setAdmin() {
    const q = query(collection(db, "users"), where("email", "==", "nvergara@abc.gob.ar"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        console.log("No user found with that email.");
    } else {
        for (const userDoc of snapshot.docs) {
            console.log("Updating role for:", userDoc.id);
            await updateDoc(doc(db, "users", userDoc.id), {
                rol: "administrador"
            });
            console.log("Success! Updated to administrador.");
        }
    }
    process.exit(0);
}

setAdmin().catch(console.error);
