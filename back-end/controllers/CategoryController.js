// Import the express-async-handler to handle exceptions in async routes.
import asyncHandler from 'express-async-handler';
// Import the Category model.
import Category from '../models/category.js';
// Import the Product model to check for associated products before deletion.
import Product from '../models/product.js';

// Create an empty object to attach our controller functions to.
const controller = {};

// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Public
controller.getCategories = asyncHandler(async (req, res) => {
  // Find all documents in the Category collection. The empty object {} means no filter.
  const categories = await Category.find({});
  // Respond with a 200 (OK) status and the array of categories.
  res.status(200).json(categories);
});

// @desc    Fetch a single category by ID
// @route   GET /api/categories/:id
// @access  Public
controller.getCategoryById = asyncHandler(async (req, res) => {
  // Find a single category by its unique ID from the URL parameter.
  const category = await Category.findById(req.params.id);

  // If a category was found with that ID,
  if (category) {
    // Respond with a 200 (OK) status and the category object.
    res.status(200).json(category);
  } else {
    // Otherwise, set a 404 (Not Found) status and throw an error.
    res.status(404);
    throw new Error('Categoria não encontrada.'); // "Category not found."
  }
});

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
controller.createCategory = asyncHandler(async (req, res) => {
  // Destructure the name, slogan, and image from the request body.
  const { name, slogan, image } = req.body;

  // Check if a category with the same name already exists to avoid duplicates.
  const categoryExists = await Category.findOne({ name });

  // If it exists, respond with a 400 (Bad Request) status and throw an error.
  if (categoryExists) {
    res.status(400);
    throw new Error('Uma categoria com este nome já existe.'); // "A category with this name already exists."
  }

  // If the name is unique, create a new category document in the database.
  const category = await Category.create({
    name,
    slogan,
    image,
  });

  // Respond with a 201 (Created) status and the new category object.
  res.status(201).json(category);
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
controller.updateCategory = asyncHandler(async (req, res) => {
  // Destructure the fields to be updated from the request body.
  const { name, slogan, image } = req.body; // Added image

  // Find the category to be updated by its ID.
  const category = await Category.findById(req.params.id);

  // If the category exists,
  if (category) {
    // Update its properties. Use the new value or fallback to the existing one.
    category.name = name || category.name;
    category.slogan = slogan || category.slogan;
    category.image = image || category.image; // Added image update

    // Note: The slug will be updated automatically by the pre-save hook in the model if the name changes.

    // Save the updated document.
    const updatedCategory = await category.save();
    // Respond with the updated category data.
    res.status(200).json(updatedCategory);
  } else {
    // If not found, respond with a 404 error.
    res.status(404);
    throw new Error('Categoria não encontrada.'); // "Category not found."
  }
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
controller.deleteCategory = asyncHandler(async (req, res) => {
  // Find the category to be deleted.
  const category = await Category.findById(req.params.id);

  // If it exists,
  if (category) {
    // IMPORTANT CHECK: Count how many products are associated with this category.
    const productsInCategory = await Product.countDocuments({ category: req.params.id });

    // If there are products in this category, prevent deletion to maintain data integrity.
    if (productsInCategory > 0) {
      res.status(400);
      throw new Error('Não é possível deletar. Existem produtos associados a esta categoria.'); // "Cannot delete. There are products associated with this category."
    }

    // If no products are associated, proceed with deletion.
    await category.deleteOne();
    // Respond with a success message.
    res.status(200).json({ message: 'Categoria deletada com sucesso.' }); // "Category deleted successfully."
  } else {
    // If not found, respond with a 404 error.
    res.status(404);
    throw new Error('Categoria não encontrada.'); // "Category not found."
  }
});

// Export the controller object.
export default controller;