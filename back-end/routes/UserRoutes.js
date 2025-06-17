import express from "express";
import controller from "../controllers/UserController.js";
import { protect, admin } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// Rotas Públicas
router.post("/register", controller.registerUser);
router.post("/login", controller.loginUser);

// Rotas Privadas (precisam do middleware 'protect')
router.post("/logout", controller.logoutUser);
router
  .route("/profile")
  .get(protect, controller.getUserProfile)
  .put(protect, controller.updateUserProfile)
  .delete(protect, controller.deleteUser);

router.route("/admin/all").get(protect, admin, controller.getAllUsersAdmin);
router
  .route("/admin/:id")
  .get(protect, admin, controller.getUserByIdAdmin)
  .delete(protect, admin, controller.deleteUserAdmin)
  .put(protect, admin, controller.updateUserAdmin);
router.post('/admin/add', protect, admin, controller.addUserAdmin);

router.route('/profile/password').put(protect, controller.updateUserPassword);

export default router;
