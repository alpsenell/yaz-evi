// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

console.log(import.meta.env)
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.MODE === 'development' ? import.meta.env.VITE_FIREBASE_API_KEY : process.env.FIREBASE_API_KEY,
  authDomain: "hotel-booking-afd0d.firebaseapp.com",
  projectId: "hotel-booking-afd0d",
  storageBucket: "hotel-booking-afd0d.firebasestorage.app",
  messagingSenderId: "293685789416",
  appId: "1:293685789416:web:ef89d2ae1845fa98697f5d",
  measurementId: "G-P3LGE3V3T4"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
const db = getFirestore(firebaseApp);

export { db }

