import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAWoIApSOekUVRRZ2U7oDIGNIfUHm_iaqA",
    authDomain: "terminal-paradox.firebaseapp.com",
    projectId: "terminal-paradox",
    storageBucket: "terminal-paradox.firebasestorage.app",
    messagingSenderId: "138053377007",
    appId: "1:138053377007:web:805f16e22463ddbccef41a",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
