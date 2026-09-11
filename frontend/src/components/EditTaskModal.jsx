import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Edit3 } from 'lucide-react';
import { useTasks } from '../contexts/TaskContext.jsx';

export const EditTaskModal = ({ task, isOpen, onClose }) => {
  const { updateTask } = useTasks();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [status, setStatus] = useState('pendente');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setTitulo(task.titulo || '');
      setDescricao(task.descricao || '');
      setStatus(task.status || 'pendente');
      setError('');
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) {
      setError('O título não pode ser vazio');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await updateTask(task.id, {
        titulo: titulo.trim(),
        descricao: descricao.trim() ? descricao.trim() : null,
        status
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Falha ao atualizar tarefa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Edit3 size={18} />
            </div>
            <h2 style={{ fontSize: '1.2rem' }}>Editar Tarefa</h2>
          </div>

          <button
            type="button"
            className="btn-ghost btn-icon"
            onClick={onClose}
            title="Fechar Modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                background: 'var(--danger-bg)',
                color: 'var(--danger)',
                border: '1px solid var(--danger-border)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '16px',
                fontSize: '0.875rem'
              }}
            >
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Título da Tarefa *</label>
            <input
              type="text"
              className="form-input"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              disabled={loading}
              maxLength={200}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Descrição</label>
            <textarea
              className="form-textarea"
              placeholder="Adicione detalhes ou notas..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              disabled={loading}
              maxLength={2000}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={loading}
            >
              <option value="pendente">⏳ Pendente</option>
              <option value="concluida">✅ Concluída</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Salvar Alterações</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
