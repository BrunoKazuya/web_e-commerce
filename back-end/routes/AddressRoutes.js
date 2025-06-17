import express from 'express';
import controller from '../controllers/AddressController.js';
import { protect } from '../middleware/AuthMiddleware.js';

const router = express.Router();

// Todas as rotas são privadas
router.route('/').post(protect, controller.addAddress).get(protect, controller.getMyAddresses);
router.route('/:id').put(protect, controller.updateAddress).delete(protect, controller.deleteAddress);

export default router;