import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema(
  {
    // Vincula o cartão a um usuário
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // O ID seguro retornado pelo gateway de pagamento (no nosso caso, simulado)
    gatewayPaymentMethodId: {
      type: String,
      required: true,
      unique: true,
    },
    // Nome do titular do cartão para identificação
    cardholderName: {
      type: String,
      required: true,
      trim: true,
    },
    // Os 4 últimos dígitos do cartão (seguro para armazenar)
    last4: {
      type: String,
      required: true,
    },
    // A bandeira do cartão (ex: "Visa", "Mastercard")
    brand: {
      type: String,
      required: true,
    },
    // Mês e ano de expiração
    expMonth: {
      type: Number,
      required: true,
    },
    expYear: {
      type: Number,
      required: true,
    },
    // Flag para marcar se é o cartão padrão
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Padrão para evitar o erro 'OverwriteModelError'
const Card = mongoose.models.Card || mongoose.model('Card', cardSchema);

export default Card;