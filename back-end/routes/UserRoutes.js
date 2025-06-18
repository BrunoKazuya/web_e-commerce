// Import the Express framework to create and manage the router.
import express from 'express';
// Import the user controller object which contains all the route handler functions.
import controller from '../controllers/UserController.js';
// Import the authentication middlewares: 'protect' for logged-in users and 'admin' for admin-only routes.
import { protect, admin } from '../middleware/AuthMiddleware.js';

// Initialize a new router object from Express.
const router = express.Router();

// --- Public Routes ---
// Defines a POST route for new user registration, handled by the registerUser function.
router.post("/register", controller.registerUser);
// Defines a POST route for user login, handled by the loginUser function.
router.post("/login", controller.loginUser);

// --- Private Routes (require user to be logged in) ---
// Defines a POST route for user logout. The user must be logged in to log out.
router.post("/logout", protect, controller.logoutUser);

// Chains multiple HTTP methods to the same '/profile' route for cleaner code.
router
  .route("/profile")
  // Defines a GET route to fetch the logged-in user's profile.
  .get(protect, controller.getUserProfile)
  // Defines a PUT route to update the logged-in user's profile.
  .put(protect, controller.updateUserProfile)

// Defines a PUT route specifically for changing the user's password.
router.route('/profile/password').put(protect, controller.updateUserPassword);


// --- Admin-Only Routes (require user to be logged in AND have an 'admin' role) ---
// Defines a POST route for an admin to create a new user.
router.post('/admin/add', protect, admin, controller.addUserAdmin);

// Defines a GET route for an admin to fetch a list of all users.
router.route("/admin/all").get(protect, admin, controller.getAllUsersAdmin);

// Chains multiple HTTP methods for an admin to act on a specific user by their ID.
router
  .route("/admin/:id")
  // Defines a GET route to fetch a single user's details.
  .get(protect, admin, controller.getUserByIdAdmin)
  // Defines a DELETE route to delete a user.
  .delete(protect, admin, controller.deleteUserAdmin)
  // Defines a PUT route to update a user's details.
  .put(protect, admin, controller.updateUserAdmin);


// Export the configured router to be used in the main server file.
export default router;