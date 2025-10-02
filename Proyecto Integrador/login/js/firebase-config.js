// js/firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3G8Zy9k4Viw1Yz-1HQcStYiyqzPA_zac",
  authDomain: "pollo-pollo-636ac.firebaseapp.com",
  projectId: "pollo-pollo-636ac",
  storageBucket: "pollo-pollo-636ac.firebasestorage.app",
  messagingSenderId: "97021655752",
  appId: "1:97021655752:web:e21ae760ed8ec2e70643fd",
  measurementId: "G-9ZYSZB9T3Z"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta los servicios de Firebase para que otros archivos los puedan usar
export const auth = getAuth(app);
export const db = getFirestore(app);