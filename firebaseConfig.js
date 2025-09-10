// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDyHd94LT1uZHjPSrK_kAC-9j_w7YCPSLU",
  authDomain: "sweet-manager-5db95.firebaseapp.com",
  projectId: "sweet-manager-5db95",
  storageBucket: "sweet-manager-5db95.firebasestorage.app",
  messagingSenderId: "808232670801",
  appId: "1:808232670801:web:afd2a9fb4efc4ed0edca70",
  measurementId: "G-615WG20G3M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);