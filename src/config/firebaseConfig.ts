import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1Mgqhd0d3WT1OBJZYjxqwMdCI3INIC3Q",
  authDomain: "hoopify-cbcd3.firebaseapp.com",
  projectId: "hoopify-cbcd3",
  storageBucket: "hoopify-cbcd3.firebasestorage.app",
  messagingSenderId: "560247756958",
  appId: "1:560247756958:web:e4585e3ab0a3bc662dc38f",
  measurementId: "G-D7BZ0K2NH9",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

console.log("🔥 Firebase Initialized: Hoopify connected!");
