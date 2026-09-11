import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';

dotenv.config();

const app = express();

// Middlewares de Segurança e Parsing
app.use(helmet());

const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(
  cors({
    origin: corsOrigin === '*' ? true : corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de Healthcheck
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API da Plataforma de Tarefas está online e operante 🚀',
    timestamp: new Date().toISOString()
  });
});

// Rotas da Aplicação
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Handler para rotas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Rota ${req.method} ${req.originalUrl} não foi encontrada no servidor`
  });
});

// Middleware Global de Tratamento de Erros
app.use(errorMiddleware);

export default app;
