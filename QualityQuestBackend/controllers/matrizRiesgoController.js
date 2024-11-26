const crearMatrizRiesgo = async (req, res) => {
    try {
      const { usuario, nombreEmpresa, descripcion } = req.body;
  
      const matriz = new MatrizRiesgo({
        usuario,
        nombreEmpresa,
        descripcion,
        analisis: [],
        diseño: [],
        codificacion: [],
        pruebas: [],
        entrega: [],
      });
  
      await matriz.save();
  
      res.status(201).json({
        mensaje: "Matriz de riesgo creada exitosamente",
        matriz,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        mensaje: "Error al crear la matriz de riesgo",
      });
    }
  };
  
  const agregarRiesgo = async (req, res) => {
    try {
      const { matrizId, fase, riesgo } = req.body;
  
      const matriz = await MatrizRiesgo.findById(matrizId);
  
      if (!matriz) {
        return res.status(404).json({ mensaje: "No se encontró la matriz de riesgo" });
      }
  
      if (!matriz[fase]) {
        return res.status(400).json({ mensaje: "Fase no válida" });
      }
  
      matriz[fase].push(riesgo); // Agrega el riesgo a la fase correspondiente
      await matriz.save();
  
      res.status(200).json({
        mensaje: `Riesgo agregado exitosamente a la fase ${fase}`,
        matriz,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        mensaje: "Error al agregar el riesgo",
      });
    }
  };

  const obtenerMatrices = async (req, res) => {
    try {
      const matrices = await MatrizRiesgo.find({ usuario: req.params.usuarioId });
      res.status(200).json(matrices);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        mensaje: "Error al obtener las matrices de riesgo",
      });
    }
  };

  const eliminarRiesgo = async (req, res) => {
    try {
      const { matrizId, fase, riesgoId } = req.body;
  
      const matriz = await MatrizRiesgo.findById(matrizId);
  
      if (!matriz) {
        return res.status(404).json({ mensaje: "No se encontró la matriz de riesgo" });
      }
  
      matriz[fase] = matriz[fase].filter((riesgo) => riesgo._id.toString() !== riesgoId);
      await matriz.save();
  
      res.status(200).json({
        mensaje: "Riesgo eliminado exitosamente",
        matriz,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        mensaje: "Error al eliminar el riesgo",
      });
    }
  };
  