// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClbcCGaO4CVwMR3hxQeAvD-cF_dt3jKAs",
  authDomain: "supergear-f2ce6.firebaseapp.com",
  projectId: "supergear-f2ce6",
  storageBucket: "supergear-f2ce6.firebasestorage.app",
  messagingSenderId: "544179180920",
  appId: "1:544179180920:web:14ddecf21a7b67d366a48d"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();