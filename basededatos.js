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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";  // Importa tu configuración de Firebase


async function agregarAlumno(alumno) {
  try {
    const docRef = await addDoc(collection(db, "alumnos"), {
      nombre: alumno.nombre,
      apellido: alumno.apellido,
      edad: alumno.edad,
      materias: []  // Lista vacía que se llenará con materias inscritas
    });
    console.log("Alumno registrado con ID: ", docRef.id);
  } catch (e) {
    console.error("Error añadiendo alumno: ", e);
  }
}

// Ejemplo de uso:
agregarAlumno({
  nombre: "Seba",
  apellido: "Lopez",
  edad: 20
});
import { collection, addDoc } from "firebase/firestore";


async function agregarMateria(materia) {
  try {
    const docRef = await addDoc(collection(db, "materias"), {
      nombre: materia.nombre,
      cupo_maximo: materia.cupo_maximo,
      alumnos: []  // Lista vacía de alumnos inscritos
    });
    console.log("Materia creada con ID: ", docRef.id);
  } catch (e) {
    console.error("Error añadiendo materia: ", e);
  }
}

// Ejemplo de uso:
agregarMateria({
  nombre: "Matemáticas",
  cupo_maximo: 30
});


import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

async function matricularAlumnoEnMateria(alumnoId, materiaId) {
  const alumnoRef = doc(db, "alumnos", alumnoId);
  const materiaRef = doc(db, "materias", materiaId);

  // Obtener datos del alumno
  const alumnoSnap = await getDoc(alumnoRef);
  const alumnoData = alumnoSnap.data();

  // Obtener datos de la materia
  const materiaSnap = await getDoc(materiaRef);
  const materiaData = materiaSnap.data();

  // Validaciones
  if (alumnoData.materias.length >= 8) {
    console.error("El alumno ya tiene el número máximo de materias.");
    return;
  }

  if (alumnoData.materias.includes(materiaId)) {
    console.error("El alumno ya está inscrito en esta materia.");
    return;
  }

  if (materiaData.alumnos.length >= materiaData.cupo_maximo) {
    console.error("No hay cupos disponibles en esta materia.");
    return;
  }

  // Matricular alumno
  await updateDoc(alumnoRef, {
    materias: arrayUnion(materiaId)
  });

  // Añadir el alumno a la materia
  await updateDoc(materiaRef, {
    alumnos: arrayUnion(alumnoId)
  });

  console.log("Alumno matriculado exitosamente.");
}

// Ejemplo de uso:
matricularAlumnoEnMateria("alumnoID123", "materiaID456");

import { collection, getDocs } from "firebase/firestore";

async function obtenerAlumnos() {
  const querySnapshot = await getDocs(collection(db, "alumnos"));
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
}

async function obtenerMaterias() {
  const querySnapshot = await getDocs(collection(db, "materias"));
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
}

// Ejemplo de uso:
obtenerAlumnos();
obtenerMaterias();
