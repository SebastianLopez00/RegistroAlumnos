// Importar Firebase Admin SDK
var admin = require("firebase-admin");
var express = require("express");
var app = express();

// Ruta a tu archivo de credenciales (la llave del servicio de Firebase)
var serviceAccount = require("../config/serviceAccountKey.json");

// Inicializar Firebase Admin con las credenciales del servicio
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://registrodealumnos-411c5-default-rtdb.firebaseio.com"
});

// Inicializar Firestore
const db = admin.firestore();

// Middleware para parsear JSON
app.use(express.json());

// Rutas de ejemplo

// Ruta para obtener todos los alumnos
app.get("/alumnos", async (req, res) => {
  try {
    const alumnosRef = db.collection("alumnos");
    const snapshot = await alumnosRef.get();
    
    let alumnos = [];
    snapshot.forEach(doc => {
      alumnos.push({ id: doc.id, ...doc.data() });
    });
    
    res.status(200).json(alumnos);
  } catch (error) {
    res.status(500).send("Error al obtener alumnos: " + error.message);
  }
});

// Ruta para añadir un alumno
app.post("/alumnos", async (req, res) => {
  try {
    const alumno = req.body;
    await db.collection("alumnos").add(alumno);
    res.status(201).send("Alumno añadido exitosamente");
  } catch (error) {
    res.status(500).send("Error al añadir alumno: " + error.message);
  }
});

// Inicializar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
