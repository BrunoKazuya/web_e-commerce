// Import the Express framework.
import express from 'express';
// Import the product controller object.
import controller from '../controllers/ProductController.js';
// Import middlewares for authentication and admin authorization.
import { protect, admin } from '../middleware/AuthMiddleware.js';

// Initialize a new router object.
const router = express.Router();

// Defines routes for the base '/api/products' path.
router.route('/')
  // Defines a GET route to fetch all products. This is public.
  .get(controller.getProducts)
  // Defines a POST route to create a new product. Admin only.
  .post(protect, admin, controller.createProduct);

// Defines routes for paths targeting a specific product ID.
router.route('/:id')
  // Defines a GET route to fetch a single product by its ID. Public.
  .get(controller.getProductById)
  // Defines a PUT route to update a product. Admin only.
  .put(protect, admin, controller.updateProduct)
  // Defines a DELETE route to delete a product. Admin only.
  .delete(protect, admin, controller.deleteProduct);

// Export the router.
export default router;