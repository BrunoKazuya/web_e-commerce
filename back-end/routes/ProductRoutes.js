import express from 'express';
import controller from '../controllers/ProductController.js';
import { protect, admin } from '../middleware/AuthMiddleware.js'; // Importe seus middlewares

const router = express.Router();

// O método .route() é uma forma limpa de encadear diferentes verbos HTTP para a mesma rota.

// Rotas para /api/products
router.route('/')
  .get(controller.getProducts) // Qualquer um pode ver os produtos
  .post(protect, admin, controller.createProduct); // Apenas admins logados podem criar

// Rotas para /api/products/:id
router.route('/:id')
  .get(controller.getProductById) // Qualquer um pode ver um produto específico
  .put(protect, admin, controller.updateProduct) // Apenas admins logados podem atualizar
  .delete(protect, admin, controller.deleteProduct); // Apenas admins logados podem deletar

export default router;