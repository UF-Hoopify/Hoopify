// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore"; // Added initializeFirestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1Mgqhd0d3WT1OBJZYjxqwMdCI3INIC3Q",
  authDomain: "hoopify-cbcd3.firebaseapp.com",
  projectId: "hoopify-cbcd3",
  storageBucket: "hoopify-cbcd3.firebasestorage.app",
  messagingSenderId: "560247756958",
  appId: "1:560247756958:web:e4585e3ab0a3bc662dc38f",
  measurementId: "G-D7BZ0K2NH9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// FIX: Force Long Polling to solve "Client Offline" issues on mobile networks
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

console.log("🔥 Firebase Initialized: Hoopify connected!");