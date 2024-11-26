import mongoose from "mongoose";
const { Schema } = mongoose;
const modeloSchema = mongoose.Schema(
  {
    nombreModelo: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
const Modelo = mongoose.model("Modelo", modeloSchema);
export default Modelo;
