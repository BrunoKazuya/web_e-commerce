import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });

  console.log(token)

  // Envia o token em um cookie HTTP-Only
  res.cookie('jwt', token, {
    httpOnly: true, // Impede acesso via JavaScript no front-end
    secure: process.env.NODE_ENV !== 'development', // Usa cookies seguros em produção
    sameSite: 'strict', // Previne ataques CSRF
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias em milissegundos
  });
};

export default generateToken;