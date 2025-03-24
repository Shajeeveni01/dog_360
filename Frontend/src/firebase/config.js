// Import Firebase SDK functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your Firebase config (already set by you)
const firebaseConfig = {
  apiKey: "AIzaSyAVy87mEqKnONe3a99YvOSonLOSkcPYF_U",
  authDomain: "dog360-8819d.firebaseapp.com",
  projectId: "dog360-8819d",
  storageBucket: "dog360-8819d.appspot.com",
  messagingSenderId: "489526043580",
  appId: "1:489526043580:web:43acc329d5ecdfa8b641b9",
  measurementId: "G-1J55ZMDVX7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };
