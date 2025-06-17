import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    street: {
      type: String,
      required: [true, "O nome da rua é obrigatório."],
      trim: true,
      maxlength: [100, "O nome da rua pode ter no máximo 100 caracteres."],
    },
    number: {
      type: String, // String para aceitar "S/N" (Sem Número) ou "100-A"
      required: [true, "O número é obrigatório."],
      trim: true,
      maxlength: [20, "O número pode ter no máximo 20 caracteres."],
    },
    complement: {
      type: String,
      trim: true,
      maxlength: [50, "O complemento pode ter no máximo 50 caracteres."],
    },
    district: {
      type: String,
      required: [true, "O bairro é obrigatório."],
      trim: true,
      maxlength: [50, "O bairro pode ter no máximo 50 caracteres."],
    },
    city: {
      type: String,
      required: [true, "A cidade é obrigatória."],
      trim: true,
      maxlength: [50, "A cidade pode ter no máximo 50 caracteres."],
    },
    state: {
      type: String,
      required: [true, "O estado (UF) é obrigatório."],
      trim: true,
      uppercase: true,
      minlength: [2, "O estado deve ter 2 caracteres (UF)."],
      maxlength: [2, "O estado deve ter 2 caracteres (UF)."],
    },
    cep: {
      type: String,
      required: [true, "O CEP é obrigatório."],
      validate: {
        validator: function (v) {
          // Valida se o CEP tem o formato XXXXX-XXX ou XXXXXXXX
          return /^\d{5}-?\d{3}$/.test(v);
        },
        message: (props) => `${props.value} não é um CEP válido!`,
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Adicionar um índice melhora a performance de buscas por usuário
    },
  },
  {
    timestamps: true,
  }
);

// "Setter" para limpar e formatar o CEP antes de salvar
// Isso garante que o CEP será sempre armazenado da mesma forma (apenas números)
AddressSchema.path("cep").set(function (cep) {
  return cep.replace(/\D/g, ""); // Remove tudo que não for dígito
});

const Address = mongoose.models.Address || mongoose.model("Address", AddressSchema);

export default Address
