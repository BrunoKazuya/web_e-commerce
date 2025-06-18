// Import the Express framework.
import express from 'express';
// Import the card controller object.
import controller from '../controllers/CardController.js';
// Import the 'protect' middleware.
import { protect } from '../middleware/AuthMiddleware.js';

// Initialize a new router object.
const router = express.Router();

// Defines routes for the base '/api/cards' path.
// All card routes are private, requiring a logged-in user.
router.route('/')
    // Defines a POST route to add a new card.
    .post(protect, controller.addCard)
    // Defines a GET route to fetch all of the user's saved cards.
    .get(protect, controller.getMyCards);

// Defines routes for paths targeting a specific card ID.
router.route('/:id')
    // Defines a DELETE route to remove a specific card.
    .delete(protect, controller.deleteCard);

// Export the router.
export default router;