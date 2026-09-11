import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api.js';
import { useAuth } from './AuthContext.jsx';

const TaskContext = createContext({});

export const TaskProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pendentes: 0,
    concluidas: 0,
    taxaConclusao: 0
  });
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [filter, setFilter] = useState('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((current) => (current?.id === toast?.id ? null : current));
    }, 4000);
  }, [toast]);

  const clearToast = () => setToast(null);

  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoadingTasks(true);
    try {
      const params = new URLSearchParams();
      if (filter && filter !== 'todas') params.append('status', filter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const queryStr = params.toString() ? `?${params.toString()}` : '';
      const response = await api.get(`/tasks${queryStr}`);

      setTasks(response.data.tarefas);
      setStats(response.data.estatisticas);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoadingTasks(false);
    }
  }, [isAuthenticated, filter, searchQuery, showToast]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    } else {
      setTasks([]);
      setStats({ total: 0, pendentes: 0, concluidas: 0, taxaConclusao: 0 });
    }
  }, [isAuthenticated, fetchTasks]);

  const createTask = async (taskData) => {
    try {
      const response = await api.post('/tasks', taskData);
      showToast('Tarefa criada com sucesso!', 'success');
      await fetchTasks();
      return response.data;
    } catch (error) {
      showToast(error.message, 'error');
      throw error;
    }
  };

  const updateTask = async (id, updatedData) => {
    try {
      const response = await api.put(`/tasks/${id}`, updatedData);
      showToast('Tarefa atualizada com sucesso!', 'success');
      await fetchTasks();
      return response.data;
    } catch (error) {
      showToast(error.message, 'error');
      throw error;
    }
  };

  const toggleTaskStatus = async (id) => {
    // Atualização otimista
    const previousTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'concluida' ? 'pendente' : 'concluida' }
          : t
      )
    );

    try {
      const response = await api.patch(`/tasks/${id}/status`);
      showToast(response.message || 'Status atualizado', 'info');
      await fetchTasks();
    } catch (error) {
      setTasks(previousTasks);
      showToast(error.message, 'error');
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      showToast('Tarefa removida com sucesso!', 'success');
      await fetchTasks();
    } catch (error) {
      showToast(error.message, 'error');
      throw error;
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        stats,
        loadingTasks,
        filter,
        setFilter,
        searchQuery,
        setSearchQuery,
        fetchTasks,
        createTask,
        updateTask,
        toggleTaskStatus,
        deleteTask,
        toast,
        showToast,
        clearToast
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks deve ser utilizado dentro de um TaskProvider');
  }
  return context;
};
