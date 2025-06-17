import express from 'express';
import controller from '../controllers/OrderController.js';
import { protect, admin } from '../middleware/AuthMiddleware.js';

const router = express.Router();

// A mesma rota '/' tem duas ações com permissões diferentes
router.route('/')
  .post(protect, controller.addOrderItems) // Usuário logado pode criar pedido
  .get(protect, admin, controller.getOrders); // Apenas admin pode ver todos os pedidos

// Rota para o usuário ver seus próprios pedidos
router.route('/myorders').get(protect, controller.getMyOrders);

// Rotas específicas para um pedido por ID
router.route('/:id')
  .get(protect, controller.getOrderById); // Usuário logado pode ver (se for dele ou se for admin)

// Rotas para admin atualizar o status do pedido
router.route('/:id/pay').put(protect, admin, controller.updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, controller.updateOrderToDelivered);

export default router;