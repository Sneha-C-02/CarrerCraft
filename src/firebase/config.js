// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ✅ Replace these with your actual Firebase credentials
const firebaseConfig = {
  apiKey: "AIzaSyB-423QNbUvJa8j9ZCKbx6YckaXj1IncnE",
  authDomain: "careercraft-921ef.firebaseapp.com",
  projectId: "careercraft-921ef",
  storageBucket: "careercraft-921ef.firebasestorage.app",
  messagingSenderId: "86267079163",
  appId: "1:86267079163:web:aeace189aeef7da387835e",
  measurementId: "G-67FLS5NT9V",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export services for use in components
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
