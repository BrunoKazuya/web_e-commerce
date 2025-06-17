import asyncHandler from 'express-async-handler';
import Category from '../models/category.js';
import Product from '../models/product.js'; // Precisamos para verificar se há produtos na categoria

const controller = {}
// @desc    Buscar todas as categorias
// @route   GET /api/categories
// @access  Público
controller.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.status(200).json(categories);
});

// @desc    Buscar uma categoria por ID
// @route   GET /api/categories/:id
// @access  Público
controller.getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    res.status(200).json(category);
  } else {
    res.status(404);
    throw new Error('Categoria não encontrada.');
  }
});

// @desc    Criar uma nova categoria
// @route   POST /api/categories
// @access  Privado/Admin
controller.createCategory = asyncHandler(async (req, res) => {
  const { name, slogan, image } = req.body;

  const categoryExists = await Category.findOne({ name });

  if (categoryExists) {
    res.status(400);
    throw new Error('Uma categoria com este nome já existe.');
  }

  const category = await Category.create({
    name,
    slogan,
    image,
  });

  res.status(201).json(category);
});

// @desc    Atualizar uma categoria
// @route   PUT /api/categories/:id
// @access  Privado/Admin
controller.updateCategory = asyncHandler(async (req, res) => {
  const { name, slogan } = req.body;

  const category = await Category.findById(req.params.id);

  if (category) {
    category.name = name || category.name;
    category.slogan = slogan || category.slogan;

    // O slug será atualizado automaticamente pelo pre-save hook no modelo

    const updatedCategory = await category.save();
    res.status(200).json(updatedCategory);
  } else {
    res.status(404);
    throw new Error('Categoria não encontrada.');
  }
});

// @desc    Deletar uma categoria
// @route   DELETE /api/categories/:id
// @access  Privado/Admin
controller.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    // VERIFICAÇÃO IMPORTANTE: Não deletar se houver produtos nesta categoria
    const productsInCategory = await Product.countDocuments({ category: req.params.id });

    if (productsInCategory > 0) {
      res.status(400);
      throw new Error('Não é possível deletar. Existem produtos associados a esta categoria.');
    }

    await category.deleteOne();
    res.status(200).json({ message: 'Categoria deletada com sucesso.' });
  } else {
    res.status(404);
    throw new Error('Categoria não encontrada.');
  }
});

export default controller;