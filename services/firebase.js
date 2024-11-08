import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";  // Importa tu configuración de Firebase

// Función para agregar un alumno
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

// Función para agregar una materia
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
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

// Función para matricular un alumno en una materia
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
import { collection, getDocs } from "firebase/firestore";

// Función para obtener todos los alumnos
async function obtenerAlumnos() {
  const querySnapshot = await getDocs(collection(db, "alumnos"));
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
}

// Función para obtener todas las materias
async function obtenerMaterias() {
  const querySnapshot = await getDocs(collection(db, "materias"));
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
}
// Agregar un nuevo alumno
agregarAlumno({
    nombre: "Seba",
    apellido: "Lopez",
    edad: 23
  });
  
  // Agregar una nueva materia
  agregarMateria({
    nombre: "MAtematica",
    cupo_maximo: 15
  });
  
  // Matricular a un alumno en una materia
  matricularAlumnoEnMateria("alumnoID123", "materiaID456");
  
  // Obtener todos los alumnos
  obtenerAlumnos();
  
  // Obtener todas las materias
  obtenerMaterias();
  