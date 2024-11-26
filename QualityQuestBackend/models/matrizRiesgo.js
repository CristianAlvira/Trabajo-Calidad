import mongoose from "mongoose";
const { Schema } = mongoose;

// Subdocumento para los riesgos de cada fase
const riesgoSchema = mongoose.Schema(
  {
    codigo: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true, trim: true },
    causaRaiz: { type: String, required: true, trim: true },
    entregablesAfectados: { type: String, required: true, trim: true },
    estimacionProbabilidad: { type: Number, required: true, min: 1, max: 5 },
    objetivoAfectado: { type: String, required: true, trim: true },
    estimacionImpacto: { type: Number, required: true, min: 1, max: 5 },
    nivelRiesgo: {
      type: Number,
      default: function () {
        return this.estimacionProbabilidad * this.estimacionImpacto;
      }, // Calculado automáticamente
    },
  },
  { _id: false } // Para usarlo como subdocumento
);

// Modelo de la matriz con todas las fases
const matrizRiesgoSchema = mongoose.Schema(
  {
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    nombreEmpresa: { type: String, required: true, trim: true },
    descripcion: { type: String, trim: true },
    analisis: [riesgoSchema],
    diseño: [riesgoSchema],
    codificacion: [riesgoSchema],
    pruebas: [riesgoSchema],
    entrega: [riesgoSchema],
    fechaCreacion: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const MatrizRiesgo = mongoose.model("MatrizRiesgo", matrizRiesgoSchema);
export default MatrizRiesgo;
