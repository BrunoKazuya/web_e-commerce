// Este middleware trata rotas não encontradas (404)
const notFound = (req, res, next) => {
  const error = new Error(`Não encontrado - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Este é o middleware principal que transforma erros em JSON
const errorHandler = (err, req, res, next) => {
  // Às vezes o erro pode vir com um status 200, nós o mudamos para 500 (erro de servidor)
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Erros específicos do Mongoose (ex: ID malformado) podem ser tratados aqui
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Recurso não encontrado';
  }

  // AQUI ESTÁ A RESPOSTA PARA SUA PERGUNTA:
  // Ele pega o status e a mensagem e envia uma resposta JSON.
  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };