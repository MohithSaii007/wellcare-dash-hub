import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBR54YYzlKaVehGTdoOyHlj1gzwa76kSoM",
  authDomain: "medicare-ecdd1.firebaseapp.com",
  projectId: "medicare-ecdd1",
  storageBucket: "medicare-ecdd1.firebasestorage.app",
  messagingSenderId: "531114785246",
  appId: "1:531114785246:web:b90bce970ce0cfa3f0054f",
  measurementId: "G-5XDN06KZL4"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;