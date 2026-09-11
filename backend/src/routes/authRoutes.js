import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';
import { registerSchema, loginSchema } from '../schemas/authSchema.js';

const router = Router();

// Rota de cadastro
router.post('/register', validate(registerSchema, 'body'), register);

// Rota de login
router.post('/login', validate(loginSchema, 'body'), login);

// Rota para obter dados do usuário autenticado
router.get('/me', authMiddleware, getMe);

export default router;
