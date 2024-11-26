//import Opinion from "../models/opinion.js";
//import Usuario from "../models/usuario.js";
//import Producto from "../models/producto.js";

const obtenerOpinionesPorProducto = async (req, res) => {
  try {
    const opiniones = await Opinion.find({ producto: req.params.id });
    res.status(200).json(opiniones);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Hubo un error al obtener las opiniones del producto",
    });
  }
};

const nuevaOpinion = async (req, res) => {
  //console.log(req.body);
  try {
    const { usuario, producto, contenidoOpinion } = req.body;

    //Buscar las opiniones del usuario por producto
    //No se debe permitir que alguien ya haya opinado sobre el producto
    const opinionExistente = await Opinion.findOne({ usuario, producto });

    if (opinionExistente) {
      return res.status(400).json({
        mensaje: "Usted ya opinó sobre el producto",
      });
    }

    const opinion = new Opinion({
      usuario,
      producto,
      contenidoOpinion,
    });

    const usuarioEncontrado = await Usuario.findById(usuario);
    opinion.correoEncontrado = usuarioEncontrado.correo;
    await opinion.populate("usuario", "email");

    await opinion.save();
    //Buscar el producto por id
    const productoOp = await Producto.findById(producto);
    //Ingresar la opinión al atributo 'opinión' del prodcuto
    productoOp.opinion.push(opinion._id);
    //Guardamos la nueva info en la base de datos
    await productoOp.save();

    res.status(201).json({
      mensaje: "Opinión correctamente guardada",
      opinion: opinion.toJSON(),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Hubo un error creando la opinión",
    });
  }
};

const obtenerOpinionesPorUsuario = async (req, res) => {
  try {
    const opiniones = await Opinion.find({ usuario: req.params.id });
    res.status(200).json(opiniones);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Hubo un error al obtener las opiniones que ha hecho el usuario",
    });
  }
};

const editarOpinion = async (req, res) => {
  const { id } = req.params;
  const { contenidoOpinion } = req.body;
  try {
    const opinion = await Opinion.findById(id);
    if (!opinion) {
      return res.status(404).json({
        mensaje: "Opinión no existe",
      });
    }
    const opinionActualizada = await Opinion.findByIdAndUpdate(
      req.params.id,
      {
        contenidoOpinion,
      },
      //Devolver datos actualizados al modelo
      { new: true }
    );
    res.status(200).json({
      mensaje: "Opinión actualizada correctamente",
      opinion: opinionActualizada,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Hubo un error editando la opinión",
    });
  }
};
const eliminarOpinion = async (req, res) => {
  try {
    const opinion = await Opinion.findById(req.params.id);
    if (!opinion) {
      return res.status(404).json({
        mensaje: "No se encontró una opinión con ese ID",
      });
    }

    // Busca el producto que contiene la opinión
    const producto = await Producto.findOne({ opinion: opinion._id });
    if (!producto) {
      return res.status(404).json({
        mensaje: "No hay producto con esa opinión",
      });
    }

    // Actualiza el array de opiniones en memoria
    const index = producto.opinion.indexOf(opinion._id);
    if (index > -1) {
      producto.opinion.splice(index, 1);
    }

    // Guarda el producto actualizado en la base de datos
    await producto.save();

    // Elimina la opinión
    const opinionEliminar = await Opinion.findByIdAndDelete(req.params.id);
    res.json({
      mensaje: "Opinión eliminada correctamente",
      opinionEliminar,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Hubo un error eliminando la opinión",
    });
  }
};
export {
  obtenerOpinionesPorProducto,
  nuevaOpinion,
  obtenerOpinionesPorUsuario,
  editarOpinion,
  eliminarOpinion,
};
