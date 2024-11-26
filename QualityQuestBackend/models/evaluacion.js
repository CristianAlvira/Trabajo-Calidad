import mongoose from "mongoose";
const { Schema } = mongoose;
const evaluacionSchema = mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectID,
      ref: "Usuario",
      required: true,
    },
    nombreEmpresa: {
      type: String,
      required: true,
      trim: true,
    },
    ciudad: {
      type: String,
      required: true,
      trim: true,
    },
    nombreSoftware: {
      type: String,
      required: true,
      trim: true,
    },
    objetivosGenerales: {
      type: String,
      required: true,
      trim: true,
    },
    objetivosEspecíficos: {
      type: String,
      required: true,
      trim: true,
    },
    parametroEvaluacion: [
      {
        type: Schema.Types.ObjectID,
        ref: "ParametroEvaluacion",
        trim: true,
      },
    ],
    valorCalificacion: {
      type: Number,
      required: false,
      trim: true,
      min: 0,
      max: 100,
    },
    modelo: {
      type: mongoose.Schema.Types.ObjectID,
      ref: "Modelo",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Evaluacion = mongoose.model("Evaluacion", evaluacionSchema);
export default Evaluacion;
