import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nome é obrigatório"],
      trim: true,
      minlength: [3, "O nome precisa ter no mínimo 3 caracteres."],
      maxlength: [50, "O nome pode ter no máximo 50 caracteres."],
    },
    email: {
      type: String,
      required: [true, "O campo e-mail é obrigatório."],
      unique: true, // Garante que não existam dois e-mails iguais no banco
      lowercase: true, // Salva o e-mail sempre em minúsculas
      trim: true,
      // Regex para validar o formato do e-mail
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Por favor, insira um endereço de e-mail válido.",
      ],
    },
    password: {
      type: String,
      required: [true, "O campo senha é obrigatório."],
      minlength: [8, "A senha deve ter no mínimo 8 caracteres."],
      select: false, // Não retorna a senha em queries por padrão
    },
    phone: {
      type: String,
      required: [true, "O telefone é obrigatório."],
      validate: {
        validator: function (v) {
          // Limpa a string e valida se tem 10 ou 11 dígitos.
          const phoneClean = v.replace(/\D/g, "");
          return /^\d{10,11}$/.test(phoneClean);
        },
        message: (props) =>
          `${props.value} não é um número de telefone válido!`,
      },
    },
    role: {
      type: String,
      enum: {
        // Apenas permite os valores dentro do array
        values: ["user", "admin"],
        message: "{VALUE} não é uma função válida.", // Mensagem de erro customizada
      },
      default: "user", // Valor padrão caso nada seja fornecido
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    // Adiciona os campos createdAt e updatedAt automaticamente
    timestamps: true,
  }
);

// Middleware (hook) do Mongoose que é executado ANTES de salvar o documento
UserSchema.pre("save", async function (next) {
  // Se a senha não foi modificada, não faz o hash novamente
  if (!this.isModified("password")) {
    return next();
  }

  // Gera o "salt" e faz o hash da senha
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método de instância para comparar a senha fornecida com a senha no banco
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User