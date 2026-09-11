import React, { useState } from 'react';
import { PlusCircle, AlignLeft, Loader2, Sparkles } from 'lucide-react';
import { useTasks } from '../contexts/TaskContext.jsx';

export const TaskForm = () => {
  const { createTask } = useTasks();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) {
      setError('Por favor, informe o título da tarefa');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await createTask({
        titulo: titulo.trim(),
        descricao: descricao.trim() ? descricao.trim() : null
      });

      setTitulo('');
      setDescricao('');
      setShowDescription(false);
    } catch (err) {
      setError(err.message || 'Erro ao criar tarefa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Sparkles size={18} color="var(--primary)" />
        <h2 style={{ fontSize: '1.15rem' }}>Nova Tarefa</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="O que você precisa realizar hoje?"
              value={titulo}
              onChange={(e) => {
                setTitulo(e.target.value);
                if (error) setError('');
              }}
              disabled={loading}
              id="new-task-title"
              maxLength={200}
            />
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowDescription(!showDescription)}
            title="Adicionar descrição detalhada"
            style={{ padding: '0.65rem 1rem' }}
          >
            <AlignLeft size={16} />
            <span style={{ fontSize: '0.85rem' }}>
              {showDescription ? 'Ocultar Detalhes' : 'Detalhes'}
            </span>
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !titulo.trim()}
            id="create-task-btn"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <PlusCircle size={18} />
                <span>Adicionar Tarefa</span>
              </>
            )}
          </button>
        </div>

        {error && <div className="form-error-text" style={{ marginTop: '8px' }}>{error}</div>}

        {showDescription && (
          <div style={{ marginTop: '14px', animation: 'fadeIn 0.2s ease-out' }}>
            <textarea
              className="form-textarea"
              placeholder="Adicione observações, links ou detalhes adicionais sobre esta tarefa (opcional)..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              disabled={loading}
              maxLength={2000}
            />
          </div>
        )}
      </form>
    </div>
  );
};
