import asyncHandler from 'express-async-handler';
import Order from '../models/order.js';
import Product from '../models/product.js';
import Address from '../models/address.js';

const controller = {}
// @desc    Criar um novo pedido
// @route   POST /api/orders
// @access  Privado
controller.addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddressId,
    paymentMethodId,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('Nenhum item no pedido.');
  }

  // A busca pelo endereço continua igual e necessária
  const addressFromDB = await Address.findById(shippingAddressId);
  if (!addressFromDB) {
    res.status(404);
    throw new Error('Endereço de entrega não encontrado.');
  }
  const shippingAddress = {
    street: addressFromDB.street,
    number: addressFromDB.number,
    complement: addressFromDB.complement,
    district: addressFromDB.district,
    city: addressFromDB.city,
    state: addressFromDB.state,
    cep: addressFromDB.cep,
  };

  // --- AQUI ESTÁ A MUDANÇA PRINCIPAL ---
  // Criamos o pedido passando os dados diretamente, sem um novo .map()
  const order = new Order({
    orderItems: orderItems, // Usamos o array diretamente como veio do front-end
    user: req.user._id,     // Adicionamos o ID do usuário logado
    shippingAddress,        // Usamos o objeto de endereço completo que buscamos
    paymentInfo: {
      gatewayPaymentMethodId: paymentMethodId,
      status: 'pending',
    },
    itemsPrice,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();

  // A lógica de atualização de estoque continua a mesma e é essencial
  for (const item of createdOrder.orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.inStock -= item.quantity;
      await product.save();
    }
  }

  res.status(201).json(createdOrder);
});

// @desc    Buscar os pedidos do usuário logado
// @route   GET /api/orders/myorders
// @access  Privado
controller.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
});

// @desc    Buscar um pedido por ID
// @route   GET /api/orders/:id
// @access  Privado
controller.getOrderById = asyncHandler(async (req, res) => {
  // .populate() busca os dados do usuário referenciado (nome e email)
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    // Verifica se o usuário é admin ou o dono do pedido
    if (req.user.role === 'admin' || order.user._id.toString() === req.user._id.toString()) {
      res.status(200).json(order);
    } else {
      res.status(403); // Forbidden
      throw new Error('Não autorizado a ver este pedido.');
    }
  } else {
    res.status(404);
    throw new Error('Pedido não encontrado.');
  }
});

// @desc    Atualizar status do pedido para "pago"
// @route   PUT /api/orders/:id/pay
// @access  Privado/Admin
controller.updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.paymentInfo.status = 'paid';
    order.paidAt = Date.now();
    // Aqui também viriam os detalhes da resposta do gateway de pagamento (req.body)
    
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Pedido não encontrado.');
  }
});

// @desc    Atualizar status do pedido para "entregue"
// @route   PUT /api/orders/:id/deliver
// @access  Privado/Admin
controller.updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.orderStatus = 'delivered';
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Pedido não encontrado.');
  }
});

// @desc    Buscar todos os pedidos (visão de admin)
// @route   GET /api/orders
// @access  Privado/Admin
controller.getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.status(200).json(orders);
});

export default controller;