// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);

document.addEventListener('DOMContentLoaded', function () {
    // Inicializa Firestore
    const db = firebase.firestore();
  
    let alumnos = []; // Lista para almacenar los alumnos temporalmente
  
    // Referencias a los elementos del DOM
    const form = document.getElementById('registroAlumno');
    const tablaAlumnos = document.getElementById('tablaAlumnos').querySelector('tbody');
    const mensaje = document.getElementById('mensaje');
  
    // Cupos disponibles por materia (puedes añadir más)
    const cuposMaterias = {
      "Matemáticas": 10,
      "Historia": 5,
      "Ciencias": 7
    };
  
    // Función para mostrar los alumnos registrados en Firestore
    const mostrarAlumnos = async () => {
      tablaAlumnos.innerHTML = ''; // Limpia la tabla antes de cargar los datos
  
      try {
        const snapshot = await db.collection('alumnos').get();
        snapshot.forEach(doc => {
          const alumno = doc.data();
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${alumno.nombre}</td>
            <td>${alumno.apellido}</td>
            <td>${alumno.edad}</td>
            <td>${alumno.idAlumno}</td>
            <td>${alumno.materia}</td>
            <td><button class="eliminar" data-id="${doc.id}">Eliminar</button></td>
          `;
          tablaAlumnos.appendChild(row);
        });
      } catch (error) {
        console.error('Error al cargar alumnos:', error);
      }
    };
  
    // Cargar los alumnos registrados al cargar la página
    mostrarAlumnos();
  
    // Función para verificar cupo de materia
    const verificarCupo = (materia) => {
      const alumnosMateria = alumnos.filter(alumno => alumno.materia === materia);
      return alumnosMateria.length < cuposMaterias[materia];
    };
  
    // Maneja el evento de agregar un alumno
    document.getElementById('agregarAlumno').addEventListener('click', () => {
      // Obtiene los valores del formulario
      const nombre = document.getElementById('nombre').value;
      const apellido = document.getElementById('apellido').value;
      const edad = document.getElementById('edad').value;
      const idAlumno = document.getElementById('idAlumno').value;
      const materia = document.getElementById('materia').value;
  
      // Verifica que los campos no estén vacíos
      if (!nombre || !apellido || !edad || !idAlumno || !materia) {
        mensaje.textContent = 'Todos los campos son obligatorios';
        return;
      }
  
      // Verifica el cupo de la materia
      if (!verificarCupo(materia)) {
        mensaje.textContent = `No hay cupo disponible para ${materia}`;
        return;
      }
  
      // Agrega el alumno a la lista temporal
      alumnos.push({ nombre, apellido, edad: parseInt(edad), idAlumno, materia });
  
      // Actualiza la tabla con el nuevo alumno
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${nombre}</td>
        <td>${apellido}</td>
        <td>${edad}</td>
        <td>${idAlumno}</td>
        <td>${materia}</td>
        <td><button class="eliminar">Eliminar</button></td>
      `;
      tablaAlumnos.appendChild(row);
  
      // Limpia el formulario
      form.reset();
      mensaje.textContent = '';
    });
  
    // Maneja el evento de eliminar un alumno
    tablaAlumnos.addEventListener('click', (e) => {
      if (e.target.classList.contains('eliminar')) {
        const row = e.target.parentElement.parentElement;
        const index = Array.from(tablaAlumnos.children).indexOf(row);
        alumnos.splice(index, 1); // Elimina el alumno de la lista
        row.remove(); // Elimina la fila de la tabla
      }
    });
  
    // Maneja el evento de registrar todos los alumnos
    document.getElementById('registrarAlumnos').addEventListener('click', async () => {
      try {
        for (const alumno of alumnos) {
          // Guarda cada alumno en Firestore
          await db.collection('alumnos').add(alumno);
        }
        mensaje.textContent = 'Alumnos registrados exitosamente';
        alumnos = []; // Limpia la lista de alumnos
        tablaAlumnos.innerHTML = ''; // Limpia la tabla
        
        // Recarga la tabla con los alumnos desde Firestore
        mostrarAlumnos();
      } catch (error) {
        console.error('Error al registrar alumnos:', error);
        mensaje.textContent = 'Error al registrar alumnos';
      }
    });
  });
  