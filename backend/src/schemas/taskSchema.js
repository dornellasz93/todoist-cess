import { z } from 'zod';

export const createTaskSchema = z.object({
  titulo: z
    .string({ required_error: 'O título da tarefa é obrigatório' })
    .trim()
    .min(1, 'O título não pode ser vazio')
    .max(200, 'O título deve ter no máximo 200 caracteres'),
  descricao: z
    .string()
    .trim()
    .max(2000, 'A descrição deve ter no máximo 2000 caracteres')
    .optional()
    .nullable()
    .transform((val) => val || null),
  status: z
    .enum(['pendente', 'concluida'], {
      errorMap: () => ({ message: 'Status deve ser "pendente" ou "concluida"' })
    })
    .optional()
    .default('pendente')
});

export const updateTaskSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(1, 'O título não pode ser vazio')
    .max(200, 'O título deve ter no máximo 200 caracteres')
    .optional(),
  descricao: z
    .string()
    .trim()
    .max(2000, 'A descrição deve ter no máximo 2000 caracteres')
    .optional()
    .nullable(),
  status: z
    .enum(['pendente', 'concluida'], {
      errorMap: () => ({ message: 'Status deve ser "pendente" ou "concluida"' })
    })
    .optional()
});

export const filterTaskSchema = z.object({
  status: z.enum(['todas', 'pendente', 'concluida']).optional().default('todas'),
  search: z.string().optional().default('')
});
