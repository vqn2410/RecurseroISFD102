import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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

async function listUsers() {
    const snapshot = await getDocs(collection(db, "users"));
    snapshot.forEach(doc => {
        console.log(doc.data().email);
    });
    process.exit(0);
}

listUsers().catch(console.error);
