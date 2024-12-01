
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDc8pBJUBsNm974DNrtXkqZbKvCspYNF2Y",
  authDomain: "yazevi-e702f.firebaseapp.com",
  projectId: "yazevi-e702f",
  storageBucket: "yazevi-e702f.firebasestorage.app",
  messagingSenderId: "871885331222",
  appId: "1:871885331222:web:e4dd0d81078a5c932e4e37",
  measurementId: "G-YMR3TZQJ9H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db
