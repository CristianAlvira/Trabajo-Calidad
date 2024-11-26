import express from "express";
import { guardarMatriz, obtenerMatricesPorUsuario } from "../controllers/MatrizController.js";

const router = express.Router();

// Ruta para guardar una nueva matriz (requiere el usuarioId en la URL)
router.post("/:usuarioId", guardarMatriz);

// Ruta para obtener matrices de un usuario específico
router.get("/:usuarioId", obtenerMatricesPorUsuario);

export default router;