import express from "express";
import {
  eliminarModelo,
  modeloInfoByIO,
  nuevoModelo,
  obtenerModelos,
} from "../controllers/modeloController.js";
const router = express.Router();
router.route("/nuevoModelo").post(nuevoModelo);
router.route("/obtenerModelos").get(obtenerModelos);
router.route("/eliminarModelo/:id").delete(eliminarModelo);
router.route("/obtenerModelo/:id").get(modeloInfoByIO);
export default router;
