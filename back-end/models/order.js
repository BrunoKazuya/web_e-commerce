import mongoose from "mongoose";

// Este é um schema para os itens DENTRO do pedido
const OrderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }, // Preço no momento da compra
  product: { // Referência ao produto original
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
});


const OrderSchema = new mongoose.Schema({
  user: { // Referência ao usuário que fez o pedido
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  // Array de itens do pedido, usando o schema definido acima
  orderItems: [OrderItemSchema],
  
  // Endereço de entrega "congelado" no momento do pedido
  shippingAddress: {
    street: { type: String, required: true },
    number: { type: String, required: true },
    complement: { type: String },
    district: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true, uppercase: true, length: 2 },
    cep: { type: String, required: true }
  },

  // Preços
  itemsPrice: { type: Number, required: true, default: 0.0 }, // Soma dos preços dos itens
  totalPrice: { type: Number, required: true, default: 0.0 }, // Soma de tudo
  
  // Status do pedido
  orderStatus: {
    type: String,
    enum: ['processing', 'shipped', 'delivered', 'cancelled'],
    default: 'processing',
    index: true
  },

}, {
  timestamps: true // Adiciona createdAt e updatedAt
});

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order