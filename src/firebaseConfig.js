// src/firebaseConfig.js

// 1. Core SDK
import { initializeApp } from "firebase/app";

// 2. Add the Firebase products you need
import { getAuth }      from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage }   from "firebase/storage";
// (optional) import { getAnalytics }  from "firebase/analytics";

// 3. Your web app’s Firebase config (copy/paste exactly)
const firebaseConfig = {
  apiKey:            "AIzaSyBxecknqywP2VJVTaaQ7aQap9iz4d0BlaA",
  authDomain:        "mamas-kithcen.firebaseapp.com",
  projectId:         "mamas-kithcen",
  storageBucket:     "mamas-kitchen.firebasestorage.app",
  messagingSenderId: "776865061393",
  appId:             "1:776865061393:web:67919e6a0b10264aef2fb0",
  measurementId:     "G-RMZQTCM6C8"
};

// 4. Initialize Firebase
const app     = initializeApp(firebaseConfig);

// 5. Initialize services and export them
export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);

// (optional) export const analytics = getAnalytics(app);
