import mongoose from "mongoose";
const { Schema } = mongoose;
import bcrypt from "bcrypt";
const usuarioSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    token: {
      type: String,
    },
    confirmado: {
      type: Boolean,
      default: false,
    },
    evaluaciones: [
      {
        type: Schema.Types.ObjectID,
        ref: "Evaluacion",
        trim: true,
      },
    ],
    matriz_Riesgo: [
      {
        type: Schema.Types.ObjectID,
        ref: "Matriz_riesgo",
        trim: true,
      },
    ],
    role: {
      type: String,
      enum: ["admin", "user"], // Opciones válidas para el rol
      default: "user", // Valor predeterminado
    },
  },
  {
    timestamps: true,
  }
);
usuarioSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

usuarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
  return await bcrypt.compare(passwordFormulario, this.password);
};

const Usuario = mongoose.model("Usuario", usuarioSchema);
export default Usuario;
