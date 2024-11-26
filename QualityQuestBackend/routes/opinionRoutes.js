import express from "express";
import {
  obtenerOpinionesPorProducto,
  nuevaOpinion,
  obtenerOpinionesPorUsuario,
  editarOpinion,
  eliminarOpinion,
} from "../controllers/opinionController.js";
import checkAuth from "../middleware/checkAuth.js";
const router = express.Router();
router.route("/").post(checkAuth, nuevaOpinion);
router
  .route("/:id")
  .get(obtenerOpinionesPorProducto)
  .put(checkAuth, editarOpinion)
  .delete(checkAuth, eliminarOpinion);
//Agregar el checkAuth
router.route("/usuarioOpiniones/:id").get(checkAuth, obtenerOpinionesPorUsuario);

export default router;
