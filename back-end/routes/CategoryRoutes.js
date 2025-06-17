import express from 'express';
import controller from '../controllers/CategoryController.js';
import { protect, admin } from '../middleware/AuthMiddleware.js';

const router = express.Router();

// Rota para buscar todas as categorias e criar uma nova
router.route('/')
  .get(controller.getCategories)
  .post(protect, admin, controller.createCategory);

// Rota para buscar, atualizar e deletar uma categoria específica
router.route('/:id')
  .get(controller.getCategoryById)
  .put(protect, admin, controller.updateCategory)
  .delete(protect, admin, controller.deleteCategory);

export default router;