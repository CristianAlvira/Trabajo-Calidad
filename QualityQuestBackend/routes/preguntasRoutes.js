import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import {
  nuevaPreguntaParemetro,
  preguntasParametroPorID,
} from "../controllers/preguntasController.js";
const router = express.Router();
router.route("/").post(nuevaPreguntaParemetro);
router.route("/preguntasParametro/:id").get(preguntasParametroPorID);

export default router;
