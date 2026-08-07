import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBmv4P3K7fe17ARlyCFcWcO8QFGY9IlTNg",
  authDomain: "typing-master-pro-af577.firebaseapp.com",
  projectId: "typing-master-pro-af577",
  storageBucket: "typing-master-pro-af577.firebasestorage.app",
  messagingSenderId: "119817270275",
  appId: "1:119817270275:web:3dad47e3aed1b2acdf8a36"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
