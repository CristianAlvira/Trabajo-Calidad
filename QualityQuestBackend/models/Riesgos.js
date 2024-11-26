import mongoose from "mongoose";

const RiesgoSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  causaRaiz: {
    type: String,
    required: true,
  },
  faseAfectada: {
    type: String,
    required: true,
  },
  entregablesAfectados: {
    type: String,
    required: true,
  },
  estimacionProbabilidad: {
    type: Number, // Cambiado a Number para reflejar los datos enviados
    default: "", // Ahora es obligatorio ya que se envía desde el frontend
  },
  objetivos: {
    alcance: { type: Number, required: true },
    tiempo: { type: Number, required: true },
    costo: { type: Number, required: true },
    calidad: { type: Number, required: true },
  },
  probabilidadImpacto: {
    alcance: { type: Number, default: ""}, // Añadidos campos individuales
    tiempo: { type: Number, default: ""},
    costo: { type: Number, default: ""},
    calidad: { type: Number, default: "" },
  },
  totalProbabilidadImpacto: {
    type: Number, // Campo adicional para la suma de los valores de probabilidadImpacto
    default: "",
  },
  nivelRiesgo: {
    type: String,
    default: "", // Ahora obligatorio ya que se calcula y envía
  },
});

const Riesgos = mongoose.model("RiesgoAnalisis", RiesgoSchema);
export default Riesgos;
