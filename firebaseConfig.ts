// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1Mgqhd0d3WT1OBJZYjxqwMdCI3INIC3Q",
  authDomain: "hoopify-cbcd3.firebaseapp.com",
  projectId: "hoopify-cbcd3",
  storageBucket: "hoopify-cbcd3.firebasestorage.app",
  messagingSenderId: "560247756958",
  appId: "1:560247756958:web:e4585e3ab0a3bc662dc38f",
  measurementId: "G-D7BZ0K2NH9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

console.log("🔥 Firebase Initialized: Hoopify connected!");
