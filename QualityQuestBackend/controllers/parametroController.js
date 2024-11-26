import ParametroEvaluacion from "../models/parametroEvaluacion.js";
import Evaluacion from "../models/evaluacion.js";

const nuevoParametro = async (req, res) => {
  try {
    const { nombreParametro, modeloID, descripcionParametro, valorPorcentaje, preguntasParametro } = req.body;

    const parametrosExistentes = await ParametroEvaluacion.find();

    let porcentajeTotal = valorPorcentaje;
    for (const parametro of parametrosExistentes) {
      porcentajeTotal += parametro.valorPorcentaje;
    }
    console.log("Porcentaje que va: ", porcentajeTotal);

    // if (porcentajeTotal > 100 || valorPorcentaje === 0) {
    //   return res.status(400).json({
    //     mensaje:
    //       "El porcentaje total de los parámetros no puede exceder el 100% y el valor del porcentaje debe ser mayor que 0",
    //   });
    // }    

    const parametroEvaluacion = new ParametroEvaluacion({
      nombreParametro,
      modeloID,
      descripcionParametro,
      valorPorcentaje,
      preguntasParametro, // Añade preguntasParametro aquí
    });

    await parametroEvaluacion.save();

    // Si todo va bien, devuelve una respuesta exitosa
    res.status(201).json({
      mensaje: `Parámetro creado exitosamente, y el porcentaje que va es: ${porcentajeTotal}`,
      parametroEvaluacion,
    });
  } catch (error) {
    console.log(error);
    // Si hay algún error, devuelve una respuesta de error
    res.status(500).json({
      mensaje: "Hubo un error creando el parametro",
    });
  }
};

// const obtenerParametros = async (req, res) => {
//   try {
//     // Buscar parámetros que no tengan el atributo modeloID o que el modeloID sea null
//     const parametros = await ParametroEvaluacion.find({
//       $or: [{ modeloID: { $exists: false } }, { modeloID: null }],
//     });

//     res.status(200).json(parametros);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       mensaje: "Hubo un error obteniendo los parámetros",
//     });
//   }
// };

// const obtenerParametros = async (req, res) => {
//   try {
//     // Buscar todos los parámetros sin filtros
//     const parametros = await ParametroEvaluacion.find();
//     res.status(200).json(parametros);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       mensaje: "Hubo un error obteniendo los parámetros",
//     });
//   }
// };

const obtenerParametros = async (req, res) => {
  try {
    const parametros = await ParametroEvaluacion.find().populate("preguntasParametro");
    res.status(200).json(parametros);
  } catch (error) {
    console.error("Error al obtener parámetros:", error);
    res.status(500).json({ mensaje: "Hubo un error obteniendo los parámetros" });
  }
};

const obtenerParametrosPorModelo = async (req, res) => {
  try {
    const modeloID = req.params.id; // Obtener el modeloID desde la URL
    const parametros = await ParametroEvaluacion.find({ modeloID }); // Buscar parámetros que coincidan con el modeloID

    if (parametros.length === 0) {
      return res.status(404).json({
        mensaje: "No se encontraron parámetros para el modelo proporcionado",
      });
    }

    res.status(200).json(parametros);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Hubo un error obteniendo los parámetros",
    });
  }
};

const eliminarParametro = async (req, res) => {
  try {
    const parametro = await ParametroEvaluacion.findById(req.params.id);
    //En caso de que no haya un parámetro con ese ID
    if (!parametro) {
      return res.status(404).json({
        mensaje: "No se encontró ningún parámetro con ese ID",
      });
    }
    const parametroElminado = await ParametroEvaluacion.findByIdAndDelete(req.params.id);
    res.json({
      mensaje: "Parámetro eliminado exitosamente",
      parametroElminado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Hubo un error al eliminar el parámetro",
    });
  }
};

const editarParametro = async (req, res) => {
  try {
    const { valorPorcentaje } = req.body;
    const parametroId = req.params.id;

    // Buscar todos los parámetros del modelo asociado
    const parametroActual = await ParametroEvaluacion.findById(parametroId);
    if (!parametroActual) {
      return res.status(404).json({ mensaje: "Parámetro no encontrado" });
    }

    const parametrosDelModelo = await ParametroEvaluacion.find({
      modeloID: parametroActual.modeloID,
    });

    // Calcular el total de porcentajes excluyendo el actual
    const totalActual = parametrosDelModelo.reduce((total, param) => {
      if (param._id.toString() !== parametroId) {
        total += param.valorPorcentaje;
      }
      return total;
    }, 0);

    // Validar que el nuevo total no exceda 100
    if (totalActual + valorPorcentaje > 100) {
      return res.status(400).json({
        mensaje: "La suma total de los porcentajes no puede exceder el 100%",
      });
    }

    // Actualizar el parámetro
    const parametroEditado = await ParametroEvaluacion.findByIdAndUpdate(
      parametroId,
      { valorPorcentaje },
      { new: true }
    );

    res.status(200).json({
      mensaje: "Parámetro actualizado correctamente",
      parametro: parametroEditado,
    });
  } catch (error) {
    console.error("Error al actualizar el parámetro:", error);
    res.status(500).json({
      mensaje: "Hubo un error al actualizar el parámetro",
    });
  }
};



export {
  nuevoParametro,
  obtenerParametros,
  obtenerParametrosPorModelo,
  eliminarParametro,
  editarParametro,
};
