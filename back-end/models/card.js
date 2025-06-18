import mongoose from 'mongoose';

// Define the schema for the Card collection.
const cardSchema = new mongoose.Schema(
  {
    // A reference to the user who owns this card.
    user: {
      type: mongoose.Schema.Types.ObjectId, // MongoDB's unique identifier type.
      required: true, // Every card must be associated with a user.
      ref: 'User', // This ID refers to a document in the 'User' collection.
    },
    // IMPORTANT: This field stores a secure token or ID from a payment gateway (e.g., Stripe, Pagar.me).
    // The full card number is NEVER stored in our database.
    gatewayPaymentMethodId: {
      type: String,
      required: true,
      unique: true, // Prevents the same payment method from being added twice.
    },
    // The cardholder's name, used for display purposes.
    cardholderName: {
      type: String,
      required: true,
      trim: true,
    },
    // The last 4 digits of the card number. This is safe to store and helps the user identify the card.
    last4: {
      type: String,
      required: true,
    },
    // The card brand (e.g., "Visa", "Mastercard"), used for display purposes.
    brand: {
      type: String,
      required: true,
    },
    // The expiration month (e.g., 12 for December).
    expMonth: {
      type: Number,
      required: true,
    },
    // The expiration year (e.g., 2028).
    expYear: {
      type: Number,
      required: true,
    },
    // A boolean flag to mark a card as the user's default payment method.
    isDefault: {
      type: Boolean,
      default: false, // Defaults to false for newly added cards.
    },
  },
  {
    timestamps: true, // Automatically adds 'createdAt' and 'updatedAt'.
  }
);

// Creates the Card model, using the pattern to prevent OverwriteModelError.
const Card = mongoose.models.Card || mongoose.model('Card', cardSchema);

// Export the Card model.
export default Card;