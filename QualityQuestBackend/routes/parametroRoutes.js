import express from "express";
import {
  editarParametro,
  eliminarParametro,
  nuevoParametro,
  obtenerParametros,
  obtenerParametrosPorModelo,
} from "../controllers/parametroController.js";
import checkAuth from "../middleware/checkAuth.js";
const router = express.Router();
router.route("/").post(nuevoParametro);
router.route("/").get(obtenerParametros);
router.route("/parametrosModelo/:id").get(obtenerParametrosPorModelo);
router.route("/:id").delete(eliminarParametro);
router.route("/:id").put(editarParametro);

export default router;
