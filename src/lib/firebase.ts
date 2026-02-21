import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJxRPpSWR0UMID6399YDNiM3qDYYirIDs",
  authDomain: "wellcare-d96d4.firebaseapp.com",
  projectId: "wellcare-d96d4",
  storageBucket: "wellcare-d96d4.firebasestorage.app",
  messagingSenderId: "27099442561",
  appId: "1:27099442561:web:f1d98b7a6883dd1000cc80",
  measurementId: "G-PB1PYGKJVS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;