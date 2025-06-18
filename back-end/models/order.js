import mongoose from "mongoose";

// Define a sub-schema for individual items within an order.
// This schema will not create its own collection; it will be embedded in the OrderSchema.
const OrderItemSchema = new mongoose.Schema({
  name: { type: String, required: true }, // A snapshot of the product name at the time of purchase.
  quantity: { type: Number, required: true, min: 1 }, // The quantity of this item purchased.
  price: { type: Number, required: true }, // A snapshot of the price at the time of purchase.
  image: { type: String, required: true }, // A snapshot of the product image.
  product: { // A reference back to the original product document.
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
});

// Define the main schema for the Order collection.
const OrderSchema = new mongoose.Schema({
  // A reference to the user who placed the order.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // An index improves performance when querying for a user's orders.
  },
  // An array of order items, using the schema defined above.
  orderItems: [OrderItemSchema],
  
  // A snapshot of the shipping address used for this specific order.
  shippingAddress: {
    street: { type: String, required: true },
    number: { type: String, required: true },
    complement: { type: String },
    district: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true, uppercase: true, length: 2 },
    cep: { type: String, required: true }
  },
  
  // A nested object for payment information.
  paymentInfo: {
      gatewayPaymentMethodId: { type: String, required: true }, // The ID of the saved card/payment method.
      status: { 
          type: String, 
          required: true,
          enum: ['pending', 'paid', 'failed'], // Payment status must be one of these values.
          default: 'pending'
      }
  },

  // Price summary for the order.
  itemsPrice: { type: Number, required: true, default: 0.0 }, // Sum of all item prices.
  shippingPrice: { type: Number, required: true, default: 0.0 }, // Cost of shipping.
  totalPrice: { type: Number, required: true, default: 0.0 }, // The final total cost.
  
  // Fulfillment status of the order.
  orderStatus: {
    type: String,
    enum: ['processing', 'shipped', 'delivered', 'cancelled'],
    default: 'processing',
    index: true // An index improves performance when filtering orders by status.
  },

  // Timestamps for specific order events.
  paidAt: { type: Date },
  deliveredAt: { type: Date },

}, {
  timestamps: true // Automatically add 'createdAt' and 'updatedAt' fields.
});

// Create and export the Order model.
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
export default Order;