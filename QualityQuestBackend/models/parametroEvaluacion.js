import mongoose from "mongoose";
const { Schema } = mongoose;

const parametroEvaluacionSchema = mongoose.Schema({
  nombreParametro: {
    type: String,
    required: true,
    trim: true,
  },
  descripcionParametro: {
    type: String,
    required: true,
    trim: true,
  },
  valorPorcentaje: {
    type: Number,
    required: true,
    trim: true,
  },
  modeloID: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "Modelo",
    required: true,
  },
  preguntasParametro: [
    {
      type: Schema.Types.ObjectID,
      ref: "PreguntasParametro",
      trim: true,
    },
  ],
});

const ParametroEvaluacion = mongoose.model("ParametroEvaluacion", parametroEvaluacionSchema);
export default ParametroEvaluacion;
