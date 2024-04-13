import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5C2q4IpKrRMD-QMuPyyIkXxKs4BFKwj0",
  authDomain: "poeter-34682.firebaseapp.com",
  projectId: "poeter-34682",
  storageBucket: "poeter-34682.appspot.com",
  messagingSenderId: "114176068025",
  appId: "1:114176068025:web:b514f6c2e1c8376f698e68",
  measurementId: "G-5HTJKNJ7NK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics;

export const db = getFirestore();
export const storage = getStorage(app, "gs://poeter-34682.appspot.com");

if (typeof window !== 'undefined') { analytics = getAnalytics(app) }