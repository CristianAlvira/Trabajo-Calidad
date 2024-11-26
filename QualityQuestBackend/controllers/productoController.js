//import Producto from "../models/producto.js";

const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.status(200).json(productos);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Hubo un error al obtener los productos",
    });
  }
};

const nuevoProducto = async (req, res) => {
  console.log(req.body);
  try {
    const { nombre_producto, descripcion, imagenPath, precio, stock, creadores } = req.body;

    const producto = new Producto({
      nombre_producto,
      descripcion,
      imagenPath,
      precio,
      stock,
      creadores,
    });

    await producto.save();

    res.status(201).json({
      mensaje: "Producto creado exitosamente",
      producto,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Hubo un error al crear el producto",
    });
  }
};

const obtenerProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    res.status(200).json(producto);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Hubo un error al obtener el producto",
    });
  }
};

const editarProducto = async (req, res) => {
  try {
    const { nombre_producto, descripcion, imagenPath, precio, stock, creadores } = req.body;
    const productoActualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      {
        nombre_producto,
        descripcion,
        imagenPath,
        precio,
        stock,
        creadores,
      },
      //Devolver datos actualizados al modelo
      { new: true }
    );
    res.status(200).json({
      mensaje: "Producto actualizado correctamente bro",
      producto: productoActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Hubo un error al actualizar el producto",
    });
  }
};
const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    //En caso de que no se encuentre el producto
    if (!producto) {
      return res.status(404).json({
        mensaje: "No se encontró ningún producto con ese ID",
      });
    }
    const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
    res.json({
      mensaje: "Producto eliminado exitosamente",
      productoEliminado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Hubo un error al eliminar el producto",
    });
  }
};
const agregarCreador = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({
        mensaje: "No hay un producto con ese ID",
      });
    }
    const creador = req.body.creador;
    //... Operador spread porque es un arreglo, se agregan todos
    producto.creadores.push(...creador);
    await producto.save();
    res.json({
      mensaje: "Creador agregador exitosamente",
      producto,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Hubo un error al agregar creador",
    });
  }
};
const eliminarCreador = async (req, res) => {
  try {
    //Primero se ve que el producto exista
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({
        mensaje: "No hay un producto con ese ID",
      });
    }
    producto.creadores = producto.creadores.filter(
      (creador) => creador.toString() !== req.body.creador
    );
    await producto.save();
    res.json({
      mensaje: "Creador eliminado exitosamente",
      producto,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Error eliminando creador",
    });
  }
};

const obtenerPrecio = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({
        mensaje: "No hay un producto con ese ID",
      });
    }
    const { precio } = producto;
    res.json({
      precio,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Hubo un error obteniendo el precio del producto",
    });
  }
};

export {
  obtenerProductos,
  nuevoProducto,
  obtenerProducto,
  editarProducto,
  eliminarProducto,
  agregarCreador,
  eliminarCreador,
  obtenerPrecio,
};
