// Import the express-async-handler to wrap async route handlers, automatically catching errors and passing them to the error middleware.
import asyncHandler from 'express-async-handler';
// Import the Address model to interact with the addresses collection in the database.
import Address from '../models/address.js';

// Create an empty object to attach our controller functions to.
const controller = {};

// @desc    Add a new address for the logged-in user
// @route   POST /api/addresses
// @access  Private
controller.addAddress = asyncHandler(async (req, res) => {
  // Destructure all address fields from the request body.
  const { street, number, complement, district, city, state, cep } = req.body;

  // Create a new Address document in the database with the provided data.
  const address = await Address.create({
    street,
    number,
    complement,
    district,
    city,
    state,
    cep,
    // Associate the address with the currently logged-in user, whose ID is available in req.user._id from the 'protect' middleware.
    user: req.user._id,
  });

  // Respond with a 201 (Created) status and the newly created address object in JSON format.
  res.status(201).json(address);
});

// @desc    Get all addresses for the logged-in user
// @route   GET /api/addresses
// @access  Private
controller.getMyAddresses = asyncHandler(async (req, res) => {
  // Find all documents in the Address collection where the 'user' field matches the logged-in user's ID.
  const addresses = await Address.find({ user: req.user._id });
  // Respond with a 200 (OK) status and the array of found addresses.
  res.status(200).json(addresses);
});

// @desc    Update a user's address
// @route   PUT /api/addresses/:id
// @access  Private
controller.updateAddress = asyncHandler(async (req, res) => {
  // Find the specific address by its unique ID, which is passed as a URL parameter.
  const address = await Address.findById(req.params.id);

  // If no address is found with that ID, set a 404 status and throw an error.
  if (!address) {
    res.status(404);
    throw new Error('Endereço não encontrado.'); // "Address not found."
  }

  // Security check: Ensure the address being updated belongs to the logged-in user.
  // Convert both ObjectIDs to strings for a reliable comparison.
  if (address.user.toString() !== req.user._id.toString()) {
    // If they don't match, the user is forbidden from performing this action. Set a 403 status and throw an error.
    res.status(403);
    throw new Error('Não autorizado a atualizar este endereço.'); // "Not authorized to update this address."
  }

  // Update each field of the address document.
  // Use the new value from the request body, or keep the existing value if a new one is not provided.
  address.street = req.body.street || address.street;
  address.number = req.body.number || address.number;
  address.complement = req.body.complement || address.complement;
  address.district = req.body.district || address.district;
  address.city = req.body.city || address.city;
  address.state = req.body.state || address.state;
  address.cep = req.body.cep || address.cep;

  // Save the updated address document back to the database.
  const updatedAddress = await address.save();
  // Respond with a 200 (OK) status and the updated address object.
  res.status(200).json(updatedAddress);
});

// @desc    Delete a user's address
// @route   DELETE /api/addresses/:id
// @access  Private
controller.deleteAddress = asyncHandler(async (req, res) => {
    // Find the specific address by its ID from the URL parameter.
    const address = await Address.findById(req.params.id);

    // If no address is found, respond with a 404 error.
    if (!address) {
        res.status(404);
        throw new Error('Endereço não encontrado.'); // "Address not found."
    }

    // Security check: ensure the user owns the address they are trying to delete.
    if (address.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Não autorizado a deletar este endereço.'); // "Not authorized to delete this address."
    }

    // If the check passes, remove the document from the database.
    await address.deleteOne();
    // Respond with a 200 (OK) status and a success message.
    res.status(200).json({ message: 'Endereço deletado com sucesso.' }); // "Address deleted successfully."
});

// Export the controller object so it can be used in the route definitions.
export default controller;