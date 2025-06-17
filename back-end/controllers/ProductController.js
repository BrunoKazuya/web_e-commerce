import asyncHandler from "express-async-handler";
import Product from "../models/product.js";
import mongoose from "mongoose";
const controller = {};
// @desc    Buscar todos os produtos
// @route   GET /api/products
// @access  Público
controller.getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).populate('category'); // {} significa buscar tudo
  res.status(200).json(products);
});

// @desc    Buscar um produto específico por ID
// @route   GET /api/products/:id
// @access  Público
controller.getProductById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(404);
    throw new Error("Produto não encontrado (ID inválido).");
  }
  
  const product = await Product.findById(req.params.id).populate('category');

  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404);
    throw new Error("Produto não encontrado.");
  }
});

// @desc    Criar um novo produto
// @route   POST /api/products
// @access  Privado/Admin
controller.createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, category, inStock } = req.body;
  const product = new Product({
    name: name,
    price: price,
    user: req.user._id, // ID do admin logado
    image: image,
    category: category, // Você precisa fornecer um ID de categoria válido
    inStock: inStock,
    description: description,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Atualizar um produto
// @route   PUT /api/products/:id
// @access  Privado/Admin
controller.updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, category, inStock } = req.body;
  console.log(inStock)
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.category = category;
    product.inStock = inStock;
    
    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Produto não encontrado.");
  }
});

// @desc    Deletar um produto
// @route   DELETE /api/products/:id
// @access  Privado/Admin
controller.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne(); // ou Product.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: "Produto deletado com sucesso." });
  } else {
    res.status(404);
    throw new Error("Produto não encontrado.");
  }
});

export default controller;
