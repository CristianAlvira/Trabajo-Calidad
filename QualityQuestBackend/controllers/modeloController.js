import Modelo from "../models/modelo.js";

const nuevoModelo = async (req, res) => {
  const { nombreModelo } = req.body;
  const existeNombreModelo = await Modelo.findOne({ nombreModelo });

  if (existeNombreModelo) {
    const error = new Error("Modelo ya registrado");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const modelo = new Modelo(req.body);
    const modeloAlmacenado = await modelo.save();
    res.json(modeloAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const obtenerModelos = async (req, res) => {
  try {
    const modelos = await Modelo.find();
    res.status(200).json(modelos);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Hubo un error obteniendo los modelos",
    });
  }
};

const eliminarModelo = async (req, res) => {
  try {
    const modelo = await Modelo.findById(req.params.id);
    //En caso de que no haya un modelo con ese ID
    if (!modelo) {
      return res.status(404).json({
        mensaje: "No se encontró ningún modelo con ese ID",
      });
    }
    const modeloElminado = await Modelo.findByIdAndDelete(req.params.id);
    res.json({
      mensaje: "Modelo eliminado exitosamente",
      modeloElminado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Hubo un error al eliminar el modelo",
    });
  }
};

const modeloInfoByIO = async (req, res) => {
  try {
    const modelo = await Modelo.findById(req.params.id);
    res.status(200).json(modelo);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Hubo un error al obtener el modelo",
    });
  }
};

export { nuevoModelo, obtenerModelos, eliminarModelo, modeloInfoByIO };
