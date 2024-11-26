import Matriz from "../models/Matriz.js";

export const guardarMatriz = async (req, res) => {
  try {
    const { usuarioId } = req.params; // Obtener el usuarioId desde los parámetros de la URL
    const { riesgos } = req.body;

    if (!usuarioId || !riesgos || riesgos.length === 0) {
      return res.status(400).json({ message: "Datos incompletos para guardar la matriz." });
    }

    const nuevaMatriz = new Matriz({
      usuarioId,
      riesgos,
    });

    await nuevaMatriz.save();
    res.status(201).json({ message: "Matriz guardada exitosamente.", matriz: nuevaMatriz });
  } catch (error) {
    console.error("Error al guardar la matriz:", error);
    res.status(500).json({ message: "Hubo un error al guardar la matriz.", error });
  }
};

export const obtenerMatricesPorUsuario = async (req, res) => {
    try {
      const { usuarioId } = req.params; // Obtener el usuarioId desde los parámetros de la URL
  
      if (!usuarioId) {
        return res.status(400).json({ message: "El usuarioId es obligatorio." });
      }
  
      const matrices = await Matriz.find({ usuarioId }).populate("usuarioId", "nombre email");
  
      if (!matrices || matrices.length === 0) {
        return res.status(404).json({ message: "No se encontraron matrices para este usuario." });
      }
  
      res.status(200).json(matrices);
    } catch (error) {
      console.error("Error al obtener matrices del usuario:", error);
      res.status(500).json({ message: "Hubo un error al obtener las matrices.", error });
    }
  };  