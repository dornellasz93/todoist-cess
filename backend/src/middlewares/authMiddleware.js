import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Acesso não autorizado: Token não fornecido ou em formato inválido'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET || 'desafio_fullstack_jwt_super_secret_key_2026';
    const decoded = jwt.verify(token, secret);

    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        nome: true,
        email: true,
        criadoEm: true
      }
    });

    if (!usuario) {
      return res.status(401).json({
        status: 'error',
        message: 'Acesso não autorizado: Usuário associado ao token não encontrado'
      });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Acesso não autorizado: Sessão expirada, faça login novamente'
      });
    }

    return res.status(401).json({
      status: 'error',
      message: 'Acesso não autorizado: Token inválido'
    });
  }
};
