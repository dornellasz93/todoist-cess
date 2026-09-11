import React, { useState } from 'react';
import { ClipboardList, Sparkles, Loader2, SearchX } from 'lucide-react';
import { useTasks } from '../contexts/TaskContext.jsx';
import { TaskCard } from './TaskCard.jsx';
import { EditTaskModal } from './EditTaskModal.jsx';

export const TaskList = () => {
  const { tasks, loadingTasks, searchQuery, filter } = useTasks();
  const [editingTask, setEditingTask] = useState(null);

  if (loadingTasks) {
    return (
      <div
        className="glass-card"
        style={{
          padding: '48px 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <Loader2 size={32} className="animate-spin" color="var(--primary)" />
        <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Carregando suas tarefas...</span>
      </div>
    );
  }

  if (tasks.length === 0) {
    const isFiltered = searchQuery.trim() !== '' || filter !== 'todas';

    return (
      <div
        className="glass-card"
        style={{
          padding: '48px 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}
        >
          {isFiltered ? <SearchX size={32} /> : <ClipboardList size={32} />}
        </div>

        <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>
          {isFiltered ? 'Nenhuma tarefa encontrada' : 'Nenhuma tarefa cadastrada ainda'}
        </h3>

        <p style={{ color: 'var(--text-muted)', maxWidth: '380px', fontSize: '0.9rem', lineHeight: 1.5 }}>
          {isFiltered
            ? 'Tente ajustar os filtros de status ou o termo de busca para encontrar o que procura.'
            : 'Comece adicionando uma nova tarefa no formulário acima para manter sua rotina organizada!'}
        </p>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={(t) => setEditingTask(t)} />
        ))}
      </div>

      <EditTaskModal
        task={editingTask}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
      />
    </>
  );
};
