import mongoose from "mongoose";

const MatrizSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  riesgos: [
    {
      codigo: String,
      descripcion: String,
      causaRaiz: String,
      faseAfectada: String,
      entregablesAfectados: String,
      estimacionProbabilidad: Number,
      nivelRiesgo: String,
      objetivos: {
        alcance: Number,
        tiempo: Number,
        costo: Number,
        calidad: Number,
      },
      probabilidadImpacto: {
        alcance: Number,
        tiempo: Number,
        costo: Number,
        calidad: Number,
      },
      totalProbabilidadImpacto: Number,
    },
  ],
});

const Matriz = mongoose.model("Matriz", MatrizSchema);
export default Matriz;