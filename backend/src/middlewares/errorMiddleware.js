export const errorMiddleware = (err, req, res, next) => {
  console.error('[Error Handler]', err);

  // Erro de JSON mal formatado no body
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      status: 'error',
      message: 'Formato JSON inválido na requisição'
    });
  }

  // Erros do Prisma
  if (err.code === 'P2002') {
    return res.status(409).json({
      status: 'error',
      message: 'Já existe um registro com os dados informados'
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      status: 'error',
      message: 'Registro solicitado não foi encontrado'
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno no servidor';

  return res.status(statusCode).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' && statusCode === 500 ? 'Erro interno no servidor' : message
  });
};
