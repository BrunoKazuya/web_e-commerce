import express from 'express';
import controller from '../controllers/CardController.js';
import { protect } from '../middleware/AuthMiddleware.js';

const router = express.Router();

// Todas as rotas de cartão são privadas e precisam do middleware 'protect'
router.route('/').post(protect, controller.addCard).get(protect, controller.getMyCards);
router.route('/:id').delete(protect, controller.deleteCard);

export default router;