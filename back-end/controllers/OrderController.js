// Import the express-async-handler to handle exceptions in async routes.
import asyncHandler from 'express-async-handler';
// Import all necessary models to create and manage orders.
import Order from '../models/order.js';
import Product from '../models/product.js';
import Address from '../models/address.js';

// Create an empty object to attach our controller functions to.
const controller = {};

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
controller.addOrderItems = asyncHandler(async (req, res) => {
  // Destructure all required data for the order from the request body.
  const {
    orderItems,
    shippingAddressId,
    paymentMethodId,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  // Check if the order contains any items. If not, it's a bad request.
  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('Nenhum item no pedido.'); // "No items in order."
  }

  // Find the full address document from the database using the provided ID.
  const addressFromDB = await Address.findById(shippingAddressId);
  // If the address doesn't exist, the order cannot be created.
  if (!addressFromDB) {
    res.status(404);
    throw new Error('Endereço de entrega não encontrado.'); // "Shipping address not found."
  }
  // Create a snapshot of the address to store in the order.
  // This is important so that if the user updates their address later, the order history remains correct.
  const shippingAddress = {
    street: addressFromDB.street,
    number: addressFromDB.number,
    complement: addressFromDB.complement,
    district: addressFromDB.district,
    city: addressFromDB.city,
    state: addressFromDB.state,
    cep: addressFromDB.cep,
  };

  // Create a new instance of the Order model with all the prepared data.
  const order = new Order({
    orderItems: orderItems, // The front-end already prepared this array in the correct format.
    user: req.user._id,     // Associate the order with the logged-in user.
    shippingAddress,        // Use the full address object we created.
    paymentInfo: {
      gatewayPaymentMethodId: paymentMethodId,
      status: 'pending', // All new orders start with a 'pending' payment status.
    },
    itemsPrice,
    shippingPrice,
    totalPrice,
  });

  // Save the new order document to the database.
  const createdOrder = await order.save();

  // IMPORTANT LOGIC: Update the stock count for each product in the order.
  for (const item of createdOrder.orderItems) {
    // Find the corresponding product in the database.
    const product = await Product.findById(item.product);
    if (product) {
      // Subtract the purchased quantity from the current stock.
      product.inStock -= item.quantity;
      // Save the product with the new stock value.
      await product.save();
    }
  }

  // Respond with a 201 (Created) status and the newly created order object.
  res.status(201).json(createdOrder);
});

// @desc    Get orders for the logged-in user
// @route   GET /api/orders/myorders
// @access  Private
controller.getMyOrders = asyncHandler(async (req, res) => {
  // Find all orders where the 'user' field matches the ID of the currently logged-in user.
  const orders = await Order.find({ user: req.user._id });
  // Respond with a 200 (OK) status and the array of orders.
  res.status(200).json(orders);
});

// @desc    Get a single order by ID
// @route   GET /api/orders/:id
// @access  Private
controller.getOrderById = asyncHandler(async (req, res) => {
  // Find the order by its ID and populate the 'user' field with their name and email.
  // .populate() replaces the user's ObjectId with the actual user document (or selected fields).
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  // If the order exists,
  if (order) {
    // Security check: Only allow access if the user is an admin OR is the owner of the order.
    if (req.user.role === 'admin' || order.user._id.toString() === req.user._id.toString()) {
      // If authorized, respond with the order data.
      res.status(200).json(order);
    } else {
      // If not authorized, respond with a 403 (Forbidden) status.
      res.status(403);
      throw new Error('Não autorizado a ver este pedido.'); // "Not authorized to view this order."
    }
  } else {
    // If no order is found, respond with a 404 (Not Found) status.
    res.status(404);
    throw new Error('Pedido não encontrado.'); // "Order not found."
  }
});

// @desc    Update order status to "paid"
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin
controller.updateOrderToPaid = asyncHandler(async (req, res) => {
  // Find the order by ID.
  const order = await Order.findById(req.params.id);

  if (order) {
    // Update the payment status and set the payment date to now.
    order.paymentInfo.status = 'paid';
    order.paidAt = Date.now();
    
    // In a real application, payment details from the gateway would be saved here (e.g., req.body.paymentResult).
    
    // Save the updated order.
    const updatedOrder = await order.save();
    // Respond with the updated order.
    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Pedido não encontrado.'); // "Order not found."
  }
});

// @desc    Update order status to "delivered"
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
controller.updateOrderToDelivered = asyncHandler(async (req, res) => {
  // Find the order by ID.
  const order = await Order.findById(req.params.id);

  if (order) {
    // Update the fulfillment status and set the delivery date to now.
    order.orderStatus = 'delivered';
    order.deliveredAt = Date.now();

    // Save the updated order.
    const updatedOrder = await order.save();
    // Respond with the updated order.
    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Pedido não encontrado.'); // "Order not found."
  }
});

// @desc    Get all orders (for admin view)
// @route   GET /api/orders
// @access  Private/Admin
controller.getOrders = asyncHandler(async (req, res) => {
  // Find all orders and populate each one with the ID and name of the associated user.
  const orders = await Order.find({}).populate('user', 'id name');
  // Respond with the full list of orders.
  res.status(200).json(orders);
});

// Export the controller object.
export default controller;