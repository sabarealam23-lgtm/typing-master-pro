import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // 👈 1. Naya import add hua hai

const firebaseConfig = {
  apiKey: "AIzaSyBmv4P3K7fe17ARlyCFcWcO8QFGY9I1TNg",
  authDomain: "typing-master-pro-af577.firebaseapp.com",
  projectId: "typing-master-pro-af577",
  storageBucket: "typing-master-pro-af577.firebasestorage.app",
  messagingSenderId: "11981720275",
  appId: "1:11981720275:web:3dad47e3aed1b2acdf8a36"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // 👈 2. Ye Firestore export add hua hai