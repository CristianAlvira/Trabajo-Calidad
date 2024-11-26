import Evaluacion from "../models/evaluacion.js";
import Usuario from "../models/usuario.js";

const nuevaEvaluacion = async (req, res) => {
  try {
    const {
      usuario,
      nombreEmpresa,
      ciudad,
      nombreSoftware,
      objetivosGenerales,
      objetivosEspecíficos,
      modelo,
    } = req.body;

    // Verifica si usuario es un objeto o un string (ID del usuario)
    const userId = typeof usuario === "object" ? usuario._id : usuario;

    const evaluacion = new Evaluacion({
      usuario: userId, // Utiliza el ID del usuario
      nombreEmpresa,
      ciudad,
      nombreSoftware,
      objetivosGenerales,
      objetivosEspecíficos,
      modelo,
    });

    // Guarda la nueva evaluación en la base de datos
    await evaluacion.save();

    await Usuario.findByIdAndUpdate(
      userId,
      { $push: { evaluaciones: evaluacion._id } },
      { new: true } // Esto es para obtener el usuario actualizado
    );

    // Si todo va bien, devuelve una respuesta exitosa
    res.status(201).json({
      mensaje: "Evaluación creada exitosamente",
      evaluacion,
    });
  } catch (error) {
    console.log(error);
    // Si hay algún error, devuelve una respuesta de error
    res.status(500).json({
      mensaje: "Hubo un error creando la evaluación",
    });
  }
};

const obtenerEvaluacionesPorUsuario = async (req, res) => {
  try {
    const evaluacionesUsuario = await Evaluacion.find({ usuario: req.params.id });
    res.status(200).json(evaluacionesUsuario);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Hubo un error al obtener las evaluaciones que ha hecho el usuario",
    });
  }
};

const eliminarEvaluacion = async (req, res) => {
  try {
    const evaluacion = await Evaluacion.findById(req.params.id);
    //En caso de que no se encuentre la evaluacion
    if (!evaluacion) {
      return res.status(404).json({
        mensaje: "No se encontró ninguna evaluación con ese ID",
      });
    }
    const evaluacionEliminada = await Evaluacion.findByIdAndDelete(req.params.id);
    res.json({
      mensaje: "Evaluación eliminada exitosamente",
      evaluacionEliminada,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Hubo un error al eliminar la evaluacion",
    });
  }
};

const obtenerEvalucionPorId = async (req, res) => {
  try {
    const evaluacion = await Evaluacion.findById(req.params.id);
    res.status(200).json(evaluacion);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Hubo un error al obtener el evaluación",
    });
  }
};

const meterPorcentajeEvaluacion = async (req, res) => {
  try {
    const { valorCalificacion } = req.body;
    // Utiliza valorCalificacion para actualizar la evaluación
    const evaluacionActualizada = await Evaluacion.findByIdAndUpdate(
      req.params.id,
      { valorCalificacion },
      { new: true }
    );
    res.status(200).json({
      mensaje: "Se le asignó la calificación correctamente",
      evaluacion: evaluacionActualizada,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Hubo un error al meter los parametros a la evaluación",
    });
  }
};

export {
  nuevaEvaluacion,
  obtenerEvaluacionesPorUsuario,
  eliminarEvaluacion,
  obtenerEvalucionPorId,
  meterPorcentajeEvaluacion,
};
