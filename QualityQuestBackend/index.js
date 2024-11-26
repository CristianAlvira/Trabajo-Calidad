import express from "express";
import conectarDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";

import usuarioRoutes from "./routes/usuarioRoutes.js";
import productoRoutes from "./routes/productoRoutes.js";
import opinionRoutes from "./routes/opinionRoutes.js";
import evaluacionRoutes from "./routes/evaluacionRoutes.js";
import parametroRoutes from "./routes/parametroRoutes.js";
import preguntasRoutes from "./routes/preguntasRoutes.js";
import modeloRoutes from "./routes/modeloRoutes.js";

import RiesgosRoutes from "./routes/RiesgosRoutes.js";
import MatrizRoutes from "./routes/MatrizRoutes.js";


const app = express();

// Middleware para manejar JSON
app.use(express.json());

// Configuración de CORS
app.use(
  cors({
    origin: "*",// Dirección del frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos HTTP permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Encabezados permitidos
  })
);

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
conectarDB();

// Rutas
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/opiniones", opinionRoutes);
app.use("/api/evaluaciones", evaluacionRoutes);
app.use("/api/parametros", parametroRoutes);
app.use("/api/preguntas", preguntasRoutes);
app.use("/api/modelos", modeloRoutes);

// Rutas para los riesgos
app.use("/api/riesgos", RiesgosRoutes);

//Ruta para obtener las matrices para un usuario
app.use("/api/matriz", MatrizRoutes);
// Puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});