// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: "task-manager-2fd57.firebaseapp.com",
  projectId: "task-manager-2fd57",
  storageBucket: "task-manager-2fd57.firebasestorage.app",
  messagingSenderId: "981495667843",
  appId: "1:981495667843:web:f610556489d8709c7b8fb6",
  measurementId: "G-MB7SX9EC3W"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
