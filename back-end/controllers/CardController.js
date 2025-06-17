import asyncHandler from 'express-async-handler';
import Card from '../models/Card.js'; // Certifique-se que o caminho está correto

const controller = {}
// @desc    Adicionar um novo cartão para o usuário logado
// @route   POST /api/cards
// @access  Privado
controller.addCard = asyncHandler(async (req, res) => {
  const { cardholderName, expMonth, expYear, last4, brand, gatewayPaymentMethodId } = req.body;

  if (!cardholderName || !expMonth || !expYear || !last4 || !brand || !gatewayPaymentMethodId) {
    res.status(400);
    throw new Error('Todos os campos do cartão são obrigatórios.');
  }

  const card = new Card({
    user: req.user._id, // Associa o cartão ao usuário logado
    cardholderName,
    expMonth,
    expYear,
    last4,
    brand,
    gatewayPaymentMethodId,
  });

  const createdCard = await card.save();
  res.status(201).json(createdCard);
});

// @desc    Buscar os cartões do usuário logado
// @route   GET /api/cards
// @access  Privado
controller.getMyCards = asyncHandler(async (req, res) => {
  const cards = await Card.find({ user: req.user._id });
  res.status(200).json(cards);
});

// @desc    Deletar um cartão
// @route   DELETE /api/cards/:id
// @access  Privado
controller.deleteCard = asyncHandler(async (req, res) => {
  const card = await Card.findById(req.params.id);

  if (card && card.user.toString() === req.user._id.toString()) {
    await card.deleteOne();
    res.status(200).json({ message: 'Cartão deletado com sucesso.' });
  } else {
    res.status(404);
    throw new Error('Cartão não encontrado ou não autorizado.');
  }
});


export default controller;