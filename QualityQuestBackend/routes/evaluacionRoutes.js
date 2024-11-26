import express from "express";
import {
  eliminarEvaluacion,
  meterPorcentajeEvaluacion,
  nuevaEvaluacion,
  obtenerEvaluacionesPorUsuario,
  obtenerEvalucionPorId,
} from "../controllers/evaluacionController.js";
import checkAuth from "../middleware/checkAuth.js";
const router = express.Router();
router.route("/").post(nuevaEvaluacion);
router.route("/usuarioEvaluaciones/:id").get(obtenerEvaluacionesPorUsuario);
router.route("/:id").delete(eliminarEvaluacion);
router.route("/:id").get(obtenerEvalucionPorId);
router.route("/:id").put(meterPorcentajeEvaluacion);
export default router;
