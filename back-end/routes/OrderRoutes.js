// Import the Express framework.
import express from 'express';
// Import the order controller object.
import controller from '../controllers/OrderController.js';
// Import middlewares for authentication and admin authorization.
import { protect, admin } from '../middleware/AuthMiddleware.js';

// Initialize a new router object.
const router = express.Router();

// Defines routes for the base '/api/orders' path.
router.route('/')
  // Defines a POST route to create a new order. Requires a logged-in user.
  .post(protect, controller.addOrderItems)
  // Defines a GET route to fetch ALL orders. Requires admin privileges.
  .get(protect, admin, controller.getOrders);

// Defines a dedicated route for a user to fetch only their own orders.
router.route('/myorders').get(protect, controller.getMyOrders);

// Defines routes for paths targeting a specific order ID.
router.route('/:id')
  // Defines a GET route for a user to view a specific order. The controller contains logic to ensure they own the order or are an admin.
  .get(protect, controller.getOrderById);

// Defines a route for an admin to mark an order as paid.
router.route('/:id/pay').put(protect, admin, controller.updateOrderToPaid);
// Defines a route for an admin to mark an order as delivered.
router.route('/:id/deliver').put(protect, admin, controller.updateOrderToDelivered);

// Export the router.
export default router;