import Riesgos from "../models/Riesgos.js";

// Obtener todos los riesgos
export const getRiesgos = async (req, res) => {
  try {
    const riesgos = await Riesgos.find();
    res.json(riesgos);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo los riesgos" });
  }
};

// Crear un nuevo riesgo
export const createRiesgo = async (req, res) => {
  try {
    const nuevoRiesgo = new Riesgos(req.body);
    await nuevoRiesgo.save();
    res.status(201).json(nuevoRiesgo);
  } catch (error) {
    res.status(400).json({ message: "Error creando el riesgo", error });
  }
};

// Actualizar un riesgo
export const updateRiesgo = async (req, res) => {
  try {
    const { id } = req.params;
    const riesgoActualizado = await Riesgos.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(riesgoActualizado);
  } catch (error) {
    res.status(400).json({ message: "Error actualizando el riesgo", error });
  }
};

// Eliminar un riesgo
export const deleteRiesgo = async (req, res) => {
  try {
    const { id } = req.params;
    await Riesgos.findByIdAndDelete(id);
    res.json({ message: "Riesgo eliminado correctamente" });
  } catch (error) {
    res.status(400).json({ message: "Error eliminando el riesgo", error });
  }
};