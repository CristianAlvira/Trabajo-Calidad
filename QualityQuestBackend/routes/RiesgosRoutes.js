import express from "express";
import {
  getRiesgos,
  createRiesgo,
  updateRiesgo,
  deleteRiesgo,
} from "../controllers/RiesgosController.js";

const router = express.Router();

router.get("/", getRiesgos);
router.post("/", createRiesgo);
router.put("/:id", updateRiesgo);
router.delete("/:id", deleteRiesgo);

export default router;
