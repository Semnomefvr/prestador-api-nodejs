const AppError = require('../errors/AppError');

function notFound(req, res, next) {
  next(new AppError(`Rota ${req.method} ${req.originalUrl} nao encontrada`, 404));
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ erro: err.message });
  }
  // JSON malformado no corpo da requisicao
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON invalido no corpo da requisicao' });
  }
  console.error(err);
  return res.status(500).json({ erro: 'Erro interno do servidor' });
}

module.exports = { notFound, errorHandler };
