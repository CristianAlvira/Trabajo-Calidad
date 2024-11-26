import mongoose from "mongoose";
const { Schema } = mongoose;
const preguntasParametroSchema = mongoose.Schema({
  nombrePregunta: {
    type: String,
    required: true,
    trim: true,
  },
  idParametro: {
    type: Schema.Types.ObjectID,
    ref: "ParametroEvaluacion",
    trim: true,
  },
  descripcionPregunta: {
    type: String,
    required: true,
    trim: true,
  },
  valorDado: {
    type: Number,
    required: true,
    min: 1,
    max: 3,
    trim: true,
  },
});

const PreguntasParametro = mongoose.model("PreguntasParametro", preguntasParametroSchema);
export default PreguntasParametro;
