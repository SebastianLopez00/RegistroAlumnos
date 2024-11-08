// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD60EKOLSgXraTs3Q9970PZxmCLD8IReHE",
  authDomain: "registrodealumnos-411c5.firebaseapp.com",
  databaseURL: "https://registrodealumnos-411c5-default-rtdb.firebaseio.com",
  projectId: "registrodealumnos-411c5",
  storageBucket: "registrodealumnos-411c5.firebasestorage.app",
  messagingSenderId: "40674985096",
  appId: "1:40674985096:web:736af3f5ce063e29c18b3d",
  measurementId: "G-SH5YRTBK2E"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
