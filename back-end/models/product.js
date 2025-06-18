import mongoose from "mongoose";

// Define the schema for the Product collection.
const ProductSchema = new mongoose.Schema(
  {
    // Define the 'name' field.
    name: {
      type: String,
      required: [true, "O nome do produto é obrigatório."],
      trim: true,
      maxlength: [100, "O nome do produto pode ter no máximo 100 caracteres."],
    },
    // Define the 'description' field.
    description: {
      type: String,
      required: [true, "A descrição do produto é obrigatória."],
      maxlength: [1000, "A descrição pode ter no máximo 1000 caracteres."],
    },
    // Define the 'price' field.
    price: {
      type: Number,
      required: [true, "O preço do produto é obrigatório."],
      min: [0, "O preço não pode ser negativo."],
      default: 0,
    },
    // Define the 'image' field, which stores the filename or path of the product image.
    image: {
      type: String,
      default: "no-product-image.jpg", // A default image if none is provided.
    },
    // Define the 'inStock' field to manage inventory.
    inStock: {
      type: Number,
      required: true,
      min: [0, "O estoque não pode ser negativo."],
      default: 0,
    },
    // Define the 'category' field, creating a relationship to the Category model.
    category: {
      type: mongoose.Schema.Types.ObjectId, // The type is a MongoDB unique identifier.
      ref: "Category", // This tells Mongoose that this ID refers to a document in the 'Category' collection.
      required: [true, "A categoria do produto é obrigatória."],
    },
    // Define the 'user' field, referencing the admin user who created the product.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // This refers to a document in the 'User' collection.
    },
  },
  {
    timestamps: true, // Automatically add 'createdAt' and 'updatedAt' fields.
  }
);

// Create and export the Product model, using the pattern to prevent OverwriteModelError.
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product;