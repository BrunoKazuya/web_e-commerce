import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "O nome do produto é obrigatório."],
      trim: true,
      maxlength: [100, "O nome do produto pode ter no máximo 100 caracteres."],
    },
    description: {
      type: String,
      required: [true, "A descrição do produto é obrigatória."],
      maxlength: [1000, "A descrição pode ter no máximo 1000 caracteres."],
    },
    price: {
      type: Number,
      required: [true, "O preço do produto é obrigatório."],
      min: [0, "O preço não pode ser negativo."],
      default: 0,
    },
    image: {
      type: String,
      default: "no-product-image.jpg",
    },
    inStock: {
      type: Number,
      required: true,
      min: [0, "O estoque não pode ser negativo."],
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // AQUI ESTÁ A "CHAVE ESTRANGEIRA"
      required: [true, "A categoria do produto é obrigatória."],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true, // Adiciona createdAt e updatedAt
  }
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product
