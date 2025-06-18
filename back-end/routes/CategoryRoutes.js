// Import the Express framework.
import express from 'express';
// Import the category controller object.
import controller from '../controllers/CategoryController.js';
// Import middlewares for authentication and admin authorization.
import { protect, admin } from '../middleware/AuthMiddleware.js';

// Initialize a new router object.
const router = express.Router();

// Defines routes for the base '/api/categories' path.
router.route('/')
  // Defines a GET route to fetch all categories. This is public and has no middleware.
  .get(controller.getCategories)
  // Defines a POST route to create a new category. This is protected and requires admin privileges.
  .post(protect, admin, controller.createCategory);

// Defines routes for paths targeting a specific category ID.
router.route('/:id')
  // Defines a GET route to fetch a single category by its ID. Public access.
  .get(controller.getCategoryById)
  // Defines a PUT route to update a category. Admin only.
  .put(protect, admin, controller.updateCategory)
  // Defines a DELETE route to delete a category. Admin only.
  .delete(protect, admin, controller.deleteCategory);

// Export the router.
export default router;