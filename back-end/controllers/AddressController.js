import asyncHandler from 'express-async-handler';
import Address from '../models/address.js';

const controller = {}

// @desc    Adicionar um novo endereço
// @route   POST /api/addresses
// @access  Privado
controller.addAddress = asyncHandler(async (req, res) => {
  const { street, number, complement, district, city, state, cep } = req.body;

  const address = await Address.create({
    street,
    number,
    complement,
    district,
    city,
    state,
    cep,
    user: req.user._id, // Associa o endereço ao usuário logado
  });

  res.status(201).json(address);
});

// @desc    Buscar os endereços do usuário logado
// @route   GET /api/addresses
// @access  Privado
controller.getMyAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id });
  res.status(200).json(addresses);
});

// @desc    Atualizar um endereço
// @route   PUT /api/addresses/:id
// @access  Privado
controller.updateAddress = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    res.status(404);
    throw new Error('Endereço não encontrado.');
  }

  // Verifica se o endereço pertence ao usuário
  if (address.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Não autorizado a atualizar este endereço.');
  }

  // Atualiza os campos
  address.street = req.body.street || address.street;
  address.number = req.body.number || address.number;
  address.complement = req.body.complement || address.complement;
  address.district = req.body.district || address.district;
  address.city = req.body.city || address.city;
  address.state = req.body.state || address.state;
  address.cep = req.body.cep || address.cep;

  const updatedAddress = await address.save();
  res.status(200).json(updatedAddress);
});

// @desc    Deletar um endereço
// @route   DELETE /api/addresses/:id
// @access  Privado
controller.deleteAddress = asyncHandler(async (req, res) => {
    const address = await Address.findById(req.params.id);

    if (!address) {
        res.status(404);
        throw new Error('Endereço não encontrado.');
    }

    if (address.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Não autorizado a deletar este endereço.');
    }

    await address.deleteOne();
    res.status(200).json({ message: 'Endereço deletado com sucesso.' });
});

export default controller;