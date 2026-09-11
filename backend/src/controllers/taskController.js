import prisma from '../prisma.js';

export const listTasks = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;
    const { status = 'todas', search = '' } = req.query;

    const where = {
      usuarioId
    };

    if (status && status !== 'todas') {
      where.status = status;
    }

    if (search && search.trim() !== '') {
      const searchTerm = search.trim();
      where.OR = [
        { titulo: { contains: searchTerm } },
        { descricao: { contains: searchTerm } }
      ];
    }

    const [tarefas, total, pendentes, concluidas] = await Promise.all([
      prisma.tarefa.findMany({
        where,
        orderBy: { criadoEm: 'desc' }
      }),
      prisma.tarefa.count({ where: { usuarioId } }),
      prisma.tarefa.count({ where: { usuarioId, status: 'pendente' } }),
      prisma.tarefa.count({ where: { usuarioId, status: 'concluida' } })
    ]);

    return res.status(200).json({
      status: 'success',
      data: {
        tarefas,
        estatisticas: {
          total,
          pendentes,
          concluidas,
          taxaConclusao: total > 0 ? Math.round((concluidas / total) * 100) : 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario.id;

    const tarefa = await prisma.tarefa.findFirst({
      where: {
        id,
        usuarioId
      }
    });

    if (!tarefa) {
      return res.status(404).json({
        status: 'error',
        message: 'Tarefa não encontrada ou não pertence a este usuário'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: tarefa
    });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { titulo, descricao, status = 'pendente' } = req.body;
    const usuarioId = req.usuario.id;

    const novaTarefa = await prisma.tarefa.create({
      data: {
        titulo,
        descricao,
        status,
        usuarioId
      }
    });

    return res.status(201).json({
      status: 'success',
      message: 'Tarefa criada com sucesso',
      data: novaTarefa
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, status } = req.body;
    const usuarioId = req.usuario.id;

    // Verificar se a tarefa existe e pertence ao usuário
    const tarefaExistente = await prisma.tarefa.findFirst({
      where: { id, usuarioId }
    });

    if (!tarefaExistente) {
      return res.status(404).json({
        status: 'error',
        message: 'Tarefa não encontrada para atualização'
      });
    }

    const dataToUpdate = {};
    if (titulo !== undefined) dataToUpdate.titulo = titulo;
    if (descricao !== undefined) dataToUpdate.descricao = descricao;
    if (status !== undefined) dataToUpdate.status = status;

    const tarefaAtualizada = await prisma.tarefa.update({
      where: { id },
      data: dataToUpdate
    });

    return res.status(200).json({
      status: 'success',
      message: 'Tarefa atualizada com sucesso',
      data: tarefaAtualizada
    });
  } catch (error) {
    next(error);
  }
};

export const toggleTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario.id;

    const tarefaExistente = await prisma.tarefa.findFirst({
      where: { id, usuarioId }
    });

    if (!tarefaExistente) {
      return res.status(404).json({
        status: 'error',
        message: 'Tarefa não encontrada'
      });
    }

    const novoStatus = tarefaExistente.status === 'concluida' ? 'pendente' : 'concluida';

    const tarefaAtualizada = await prisma.tarefa.update({
      where: { id },
      data: { status: novoStatus }
    });

    return res.status(200).json({
      status: 'success',
      message: `Tarefa marcada como ${novoStatus}`,
      data: tarefaAtualizada
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario.id;

    const tarefaExistente = await prisma.tarefa.findFirst({
      where: { id, usuarioId }
    });

    if (!tarefaExistente) {
      return res.status(404).json({
        status: 'error',
        message: 'Tarefa não encontrada ou não pertence a este usuário'
      });
    }

    await prisma.tarefa.delete({
      where: { id }
    });

    return res.status(200).json({
      status: 'success',
      message: 'Tarefa removida com sucesso',
      data: { id }
    });
  } catch (error) {
    next(error);
  }
};
