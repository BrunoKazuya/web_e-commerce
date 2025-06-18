// Import the express-async-handler to handle exceptions in async routes.
import asyncHandler from 'express-async-handler';
// Import the Card model to interact with the cards collection.
import Card from '../models/card.js';

// Create an empty object to attach our controller functions to.
const controller = {};

// @desc    Add a new card for the logged-in user
// @route   POST /api/cards
// @access  Private
controller.addCard = asyncHandler(async (req, res) => {
  // Destructure all required card fields from the request body.
  const { cardholderName, expMonth, expYear, last4, brand, gatewayPaymentMethodId } = req.body;

  // Basic validation to ensure all necessary data was sent from the front-end.
  if (!cardholderName || !expMonth || !expYear || !last4 || !brand || !gatewayPaymentMethodId) {
    res.status(400); // Set status to 400 (Bad Request).
    throw new Error('Todos os campos do cartão são obrigatórios.'); // "All card fields are required."
  }

  // Create a new instance of the Card model.
  const card = new Card({
    user: req.user._id, // Associate the card with the logged-in user.
    cardholderName,
    expMonth,
    expYear,
    last4,
    brand,
    gatewayPaymentMethodId, // The secure token/ID from the payment gateway.
  });

  // Save the new card document to the database.
  const createdCard = await card.save();
  // Respond with a 201 (Created) status and the newly created card object.
  res.status(201).json(createdCard);
});

// @desc    Get all cards for the logged-in user
// @route   GET /api/cards
// @access  Private
controller.getMyCards = asyncHandler(async (req, res) => {
  // Find all documents in the Card collection where the 'user' field matches the logged-in user's ID.
  const cards = await Card.find({ user: req.user._id });
  // Respond with a 200 (OK) status and the array of cards.
  res.status(200).json(cards);
});

// @desc    Delete a user's card
// @route   DELETE /api/cards/:id
// @access  Private
controller.deleteCard = asyncHandler(async (req, res) => {
  // Find the specific card by its unique ID from the URL parameter.
  const card = await Card.findById(req.params.id);

  // Check if the card exists AND if the user ID on the card matches the logged-in user's ID.
  if (card && card.user.toString() === req.user._id.toString()) {
    // If both checks pass, remove the card document from the database.
    await card.deleteOne();
    // Respond with a 200 (OK) status and a success message.
    res.status(200).json({ message: 'Cartão deletado com sucesso.' }); // "Card deleted successfully."
  } else {
    // If the card doesn't exist or the user is not the owner, respond with a 404 error.
    res.status(404);
    throw new Error('Cartão não encontrado ou não autorizado.'); // "Card not found or not authorized."
  }
});

// Export the controller object.
export default controller;