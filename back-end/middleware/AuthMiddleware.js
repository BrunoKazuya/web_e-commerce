import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/user.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Lê o token JWT do cookie HTTP-Only
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Anexa o usuário ao objeto req (sem a senha)
      req.user = await User.findById(decoded.userId).select('-password');
      next(); // Continua para a próxima função (o controller)
    } catch (error) {
      res.status(401);
      throw new Error('Não autorizado, token falhou.');
    }
  } else {
    res.status(401);
    throw new Error('Não autorizado, sem token.');
  }
});

// Opcional: middleware para permitir apenas admins
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403); // Forbidden
    throw new Error('Não autorizado como administrador.');
  }
};

export { protect, admin };