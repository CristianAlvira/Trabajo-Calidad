import PreguntasParametro from "../models/preguntasParametro.js";

// Controlador para crear una nueva pregunta
const nuevaPreguntaParemetro = async (req, res) => {
  try {
    const { nombrePregunta, idParametro, descripcionPregunta, valorDado } = req.body;
    const pregunta = new PreguntasParametro({
      nombrePregunta,
      idParametro,
      descripcionPregunta,
      valorDado,
    });
    await pregunta.save(); // Aquí se guarda la nueva pregunta
    res.status(201).json({
      mensaje: "Pregunta creada exitosamente",
      pregunta,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Hubo un error al crear la pregunta",
    });
  }
};

// Controlador para obtener todas las preguntas por el idParametro
const preguntasParametroPorID = async (req, res) => {
  try {
    const parametroID = req.params.id; // Obtener el id del parámetro desde la URL
    const preguntas = await PreguntasParametro.find({ idParametro: parametroID }); // Buscar las preguntas en la base de datos

    if (preguntas.length === 0) {
      return res.status(404).json({
        mensaje: "No se encontraron preguntas para el parámetro proporcionado",
      });
    }

    res.status(200).json({
      mensaje: "Preguntas encontradas exitosamente",
      preguntas,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Hubo un error al obtener las preguntas",
    });
  }
};

export { nuevaPreguntaParemetro, preguntasParametroPorID };
