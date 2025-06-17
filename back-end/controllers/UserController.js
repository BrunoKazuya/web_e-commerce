import User from "../models/user.js"
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';

const controller = {}
// @desc    Registrar um novo usuário
// @route   POST /api/users/register
// @access  Público
controller.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('Usuário já existe.');
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role,
  });

  if (user) {
    generateToken(res, user._id); // Gera o token e loga o usuário
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error('Dados de usuário inválidos.');
  }
});

// @desc    Autenticar usuário e obter token (Login)
// @route   POST /api/users/login
// @access  Público
controller.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Encontra o usuário e inclui a senha na busca
  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.comparePassword(password))) {
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(401); // Não autorizado
    throw new Error('E-mail ou senha inválidos.');
  }
});

// @desc    Deslogar usuário / limpar cookie
// @route   POST /api/users/logout
// @access  Privado
controller.logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0), // Expira o cookie imediatamente
  });

  res.status(200).json({ message: 'Logout realizado com sucesso.' });
});

// @desc    Atualizar perfil do usuário
// @route   PUT /api/users/profile
// @access  Privado
controller.updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id); // req.user virá do middleware de auth

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    if (req.body.password) {
      user.password = req.body.password;
    }

    if(req.body.role){
        user.role = req.body.role;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error('Usuário não encontrado.');
  }
});

// @desc    Deletar perfil do usuário
// @route   DELETE /api/users/profile
// @access  Privado
controller.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Adicional: antes de deletar, você pode querer remover dados relacionados,
    // como endereços, etc. ou apenas deixar os registros órfãos.
    await User.findByIdAndDelete(req.user._id);
    res.status(200).json({ message: 'Usuário deletado com sucesso.' });
  } else {
    res.status(404);
    throw new Error('Usuário não encontrado.');
  }
});

// @desc    Buscar todos os usuários (Admin)
// @route   GET /api/users/admin/all
// @access  Privado/Admin
controller.getAllUsersAdmin = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

// @desc    Buscar um usuário por ID (Admin)
// @route   GET /api/users/admin/:id
// @access  Privado/Admin
controller.getUserByIdAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error('Usuário não encontrado.');
  }
});

// @desc    Deletar um usuário (Admin)
// @route   DELETE /api/users/admin/:id
// @access  Privado/Admin
controller.deleteUserAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.role === 'admin') {
      res.status(400);
      throw new Error('Não é possível deletar um usuário administrador.');
    }
    await user.deleteOne();
    res.status(200).json({ message: 'Usuário deletado com sucesso.' });
  } else {
    res.status(404);
    throw new Error('Usuário não encontrado.');
  }
});

// @desc    Atualizar um usuário (Admin)
// @route   PUT /api/users/admin/:id
// @access  Privado/Admin
controller.updateUserAdmin = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        user.phone = req.body.phone || user.phone;
        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } else {
        res.status(404);
        throw new Error('Usuário não encontrado.');
    }
});

controller.getUserProfile = asyncHandler(async (req, res) => {
  // O middleware 'protect' já nos deu o req.user
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } else {
    res.status(404);
    throw new Error('Usuário não encontrado.');
  }
});


// @desc    Criar um novo usuário (Admin)
// @route   POST /api/users/admin/add
// @access  Privado/Admin
controller.addUserAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('Um usuário com este e-mail já existe.');
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error('Dados de usuário inválidos.');
  }
});

controller.updateUserPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  // O middleware 'protect' já nos deu o usuário completo
  const user = await User.findById(req.user._id).select('+password');

  if (user && (await user.comparePassword(currentPassword))) {
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: 'Senha atualizada com sucesso.' });
  } else {
    res.status(401);
    throw new Error('Senha atual inválida.');
  }
});

export default controller;