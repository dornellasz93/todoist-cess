import { Router } from 'express';
import {
  listTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTaskStatus,
  deleteTask
} from '../controllers/taskController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';
import {
  createTaskSchema,
  updateTaskSchema,
  filterTaskSchema
} from '../schemas/taskSchema.js';

const router = Router();

// Todas as rotas de tarefas são protegidas por autenticação
router.use(authMiddleware);

// Listar tarefas (com filtros de status e busca)
router.get('/', validate(filterTaskSchema, 'query'), listTasks);

// Obter tarefa por ID
router.get('/:id', getTaskById);

// Criar nova tarefa
router.post('/', validate(createTaskSchema, 'body'), createTask);

// Atualizar tarefa completa/parcial
router.put('/:id', validate(updateTaskSchema, 'body'), updateTask);

// Alternar status da tarefa (pendente <-> concluida)
router.patch('/:id/status', toggleTaskStatus);

// Deletar tarefa
router.delete('/:id', deleteTask);

export default router;
