// Import the Express framework.
import express from 'express';
// Import the address controller object.
import controller from '../controllers/AddressController.js';
// Import the 'protect' middleware to secure the routes.
import { protect } from '../middleware/AuthMiddleware.js';

// Initialize a new router object.
const router = express.Router();

// Defines routes for the base '/api/addresses' path.
// All address routes are private and require the user to be logged in.
router.route('/')
    // Defines a POST route to add a new address, handled by addAddress.
    .post(protect, controller.addAddress)
    // Defines a GET route to fetch all addresses for the logged-in user, handled by getMyAddresses.
    .get(protect, controller.getMyAddresses);

// Defines routes for paths with a specific address ID, e.g., '/api/addresses/:id'.
router.route('/:id')
    // Defines a PUT route to update a specific address, handled by updateAddress.
    .put(protect, controller.updateAddress)
    // Defines a DELETE route to delete a specific address, handled by deleteAddress.
    .delete(protect, controller.deleteAddress);

// Export the router.
export default router;