// Import the express-async-handler to handle exceptions in async routes.
import asyncHandler from "express-async-handler";
// Import the Product model.
import Product from "../models/product.js";
// Import mongoose to use its utilities, like checking for valid ObjectIDs.
import mongoose from "mongoose";

// Create an empty object to attach our controller functions to.
const controller = {};

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
controller.getProducts = asyncHandler(async (req, res) => {
  // Find all products and populate their 'category' field with the full category document.
  const products = await Product.find({}).populate('category');
  // Respond with a 200 (OK) status and the array of products.
  res.status(200).json(products);
});

// @desc    Fetch a single product by ID
// @route   GET /api/products/:id
// @access  Public
controller.getProductById = asyncHandler(async (req, res) => {
  // First, check if the provided ID has a valid MongoDB ObjectId format.
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    // If not, it can't possibly exist, so return a 404 immediately.
    res.status(404);
    throw new Error("Produto não encontrado (ID inválido)."); // "Product not found (invalid ID)."
  }
  
  // If the ID format is valid, try to find the product and populate its category.
  const product = await Product.findById(req.params.id).populate('category');

  // If a product was found,
  if (product) {
    // Respond with the product object.
    res.status(200).json(product);
  } else {
    // If no product was found for that valid ID, respond with a 404 error.
    res.status(404);
    throw new Error("Produto não encontrado."); // "Product not found."
  }
});

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
controller.createProduct = asyncHandler(async (req, res) => {
  // Destructure the necessary fields from the request body sent by the admin form.
  const { name, price, description, image, brand, category, inStock } = req.body;

  // Create a new instance of the Product model with the form data.
  const product = new Product({
    name,
    price,
    description,
    image,
    category, // This should be a valid ObjectId for an existing Category.
    inStock,
    user: req.user._id, // Associate the product with the admin user who created it.
  });

  // Save the new product to the database.
  const createdProduct = await product.save();
  // Respond with a 201 (Created) status and the new product data.
  res.status(201).json(createdProduct);
});

// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Private/Admin
controller.updateProduct = asyncHandler(async (req, res) => {
  // Destructure the fields to be updated from the request body.
  const { name, price, description, image, brand, category, inStock } = req.body;

  // Find the product to be updated by its ID.
  const product = await Product.findById(req.params.id);

  // If the product exists,
  if (product) {
    // Update its properties. Use the new value or fallback to the existing one.
    product.name = name || product.name;
    product.price = price ?? product.price; // Use ?? to allow a price of 0.
    product.description = description || product.description;
    product.image = image || product.image;
    product.category = category || product.category;
    product.inStock = inStock ?? product.inStock; // Use ?? to allow a stock of 0.
    
    // Save the updated document.
    const updatedProduct = await product.save();
    // Respond with the updated product data.
    res.status(200).json(updatedProduct);
  } else {
    // If not found, respond with a 404 error.
    res.status(404);
    throw new Error("Produto não encontrado."); // "Product not found."
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
controller.deleteProduct = asyncHandler(async (req, res) => {
  // Find the product to be deleted.
  const product = await Product.findById(req.params.id);

  // If it exists,
  if (product) {
    // Remove the document from the database.
    await product.deleteOne();
    // Respond with a success message.
    res.status(200).json({ message: "Produto deletado com sucesso." }); // "Product deleted successfully."
  } else {
    // If not found, respond with a 404 error.
    res.status(404);
    throw new Error("Produto não encontrado."); // "Product not found."
  }
});

// Export the controller object.
export default controller;