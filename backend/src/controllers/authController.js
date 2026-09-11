import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'desafio_fullstack_jwt_super_secret_key_2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ id: userId }, secret, { expiresIn });
};

export const register = async (req, res, next) => {
  try {
    const { nome, email, senha } = req.body;

    // Verificar duplicidade de e-mail
    const existingUser = await prisma.usuario.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'Este e-mail já está cadastrado no sistema'
      });
    }

    // Hash seguro de senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(senha, saltRounds);

    // Criação do usuário
    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: hashedPassword
      },
      select: {
        id: true,
        nome: true,
        email: true,
        criadoEm: true
      }
    });

    const token = generateToken(usuario.id);

    return res.status(201).json({
      status: 'success',
      message: 'Usuário cadastrado com sucesso',
      usuario,
      token
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    // Busca do usuário
    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario) {
      return res.status(401).json({
        status: 'error',
        message: 'E-mail ou senha inválidos'
      });
    }

    // Validação da senha criptografada
    const passwordMatch = await bcrypt.compare(senha, usuario.senha);
    if (!passwordMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'E-mail ou senha inválidos'
      });
    }

    const token = generateToken(usuario.id);

    return res.status(200).json({
      status: 'success',
      message: 'Login realizado com sucesso',
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        criadoEm: usuario.criadoEm
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    return res.status(200).json({
      status: 'success',
      usuario: req.usuario
    });
  } catch (error) {
    next(error);
  }
};
