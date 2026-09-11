import React, { useState } from 'react';
import {
  Check,
  Edit2,
  Trash2,
  Clock,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { useTasks } from '../contexts/TaskContext.jsx';

export const TaskCard = ({ task, onEdit }) => {
  const { toggleTaskStatus, deleteTask } = useTasks();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const isCompleted = task.status === 'concluida';

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await toggleTaskStatus(task.id);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
    } catch {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className="glass-card"
      style={{
        padding: '18px 20px',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        transition: 'all var(--transition-fast)',
        opacity: isCompleted ? 0.75 : 1,
        borderColor: isCompleted ? 'rgba(16, 185, 129, 0.2)' : 'var(--border-color)'
      }}
    >
      {/* Checkbox Button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={isToggling}
        style={{
          width: '24px',
          height: '24px',
          minWidth: '24px',
          borderRadius: 'var(--radius-sm)',
          border: `2px solid ${isCompleted ? 'var(--success)' : 'var(--text-subtle)'}`,
          background: isCompleted ? 'var(--success)' : 'transparent',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          marginTop: '2px',
          transition: 'all var(--transition-fast)'
        }}
        title={isCompleted ? 'Marcar como pendente' : 'Marcar como concluída'}
        aria-label="Alternar status da tarefa"
      >
        {isToggling ? (
          <Loader2 size={14} className="animate-spin" color="var(--primary)" />
        ) : isCompleted ? (
          <Check size={16} strokeWidth={3} />
        ) : null}
      </button>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
          <h3
            style={{
              fontSize: '1.05rem',
              fontWeight: 600,
              color: isCompleted ? 'var(--text-subtle)' : 'var(--text-main)',
              textDecoration: isCompleted ? 'line-through' : 'none',
              wordBreak: 'break-word',
              lineHeight: 1.3
            }}
          >
            {task.titulo}
          </h3>

          <span className={isCompleted ? 'badge badge-completed' : 'badge badge-pending'}>
            {isCompleted ? <CheckCircle2 size={12} /> : <Clock size={12} />}
            {isCompleted ? 'Concluída' : 'Pendente'}
          </span>
        </div>

        {task.descricao && (
          <p
            style={{
              fontSize: '0.875rem',
              color: isCompleted ? 'var(--text-subtle)' : 'var(--text-muted)',
              marginBottom: '10px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              lineHeight: 1.45
            }}
          >
            {task.descricao}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
          <Calendar size={13} />
          <span>Criado em {formatDate(task.criadoEm)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {showDeleteConfirm ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--bg-input)',
              padding: '4px 8px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--danger-border)',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            <AlertTriangle size={14} color="var(--danger)" />
            <span style={{ fontSize: '0.75rem', color: 'var(--danger)', fontWeight: 600 }}>Excluir?</span>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="btn btn-danger"
              style={{ padding: '2px 8px', fontSize: '0.75rem' }}
            >
              {isDeleting ? <Loader2 size={12} className="animate-spin" /> : 'Sim'}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
              className="btn btn-secondary"
              style={{ padding: '2px 8px', fontSize: '0.75rem' }}
            >
              Não
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onEdit(task)}
              className="btn-ghost btn-icon"
              title="Editar Tarefa"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Editar"
            >
              <Edit2 size={17} />
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="btn-ghost btn-icon"
              title="Excluir Tarefa"
              style={{ color: 'var(--danger)' }}
              aria-label="Excluir"
            >
              <Trash2 size={17} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
