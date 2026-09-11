import React, { useState } from 'react';
import {
  CheckSquare,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';

export const AuthPage = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !senha) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (!isLogin && !nome.trim()) {
      setError('Por favor, informe seu nome completo');
      return;
    }

    if (senha.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await login(email, senha);
      } else {
        await register(nome, email, senha);
      }
    } catch (err) {
      setError(err.message || 'Falha ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (loginMode) => {
    setIsLogin(loginMode);
    setError('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        position: 'relative',
        background: 'radial-gradient(ellipse at 50% 10%, rgba(99, 102, 241, 0.15), transparent 70%), var(--bg-main)'
      }}
    >
      <div className="container-sm">
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-gradient)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: 'var(--shadow-glow)',
              marginBottom: '12px'
            }}
          >
            <CheckSquare size={30} strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '4px' }}>TaskFlow</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {isLogin ? 'Faça login para gerenciar suas tarefas' : 'Crie sua conta gratuita em segundos'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-card" style={{ padding: '32px 28px' }}>
          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              background: 'var(--bg-input)',
              padding: '4px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              marginBottom: '24px'
            }}
          >
            <button
              type="button"
              onClick={() => toggleMode(true)}
              className="btn"
              style={{
                flex: 1,
                padding: '0.6rem',
                fontSize: '0.9rem',
                borderRadius: 'var(--radius-sm)',
                background: isLogin ? 'var(--bg-card)' : 'transparent',
                color: isLogin ? 'var(--text-main)' : 'var(--text-muted)',
                boxShadow: isLogin ? 'var(--shadow-sm)' : 'none'
              }}
              id="tab-login"
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => toggleMode(false)}
              className="btn"
              style={{
                flex: 1,
                padding: '0.6rem',
                fontSize: '0.9rem',
                borderRadius: 'var(--radius-sm)',
                background: !isLogin ? 'var(--bg-card)' : 'transparent',
                color: !isLogin ? 'var(--text-main)' : 'var(--text-muted)',
                boxShadow: !isLogin ? 'var(--shadow-sm)' : 'none'
              }}
              id="tab-register"
            >
              Criar Conta
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div
              style={{
                background: 'var(--danger-bg)',
                color: 'var(--danger)',
                border: '1px solid var(--danger-border)',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '18px',
                fontSize: '0.875rem',
                animation: 'fadeIn 0.2s ease-out'
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label className="form-label" htmlFor="auth-nome">Nome Completo</label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <User size={18} />
                  </div>
                  <input
                    id="auth-nome"
                    type="text"
                    className="form-input has-icon"
                    placeholder="Seu nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    disabled={loading}
                    required={!isLogin}
                    maxLength={100}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="auth-email">E-mail</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <Mail size={18} />
                </div>
                <input
                  id="auth-email"
                  type="email"
                  className="form-input has-icon"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="auth-senha">Senha</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <Lock size={18} />
                </div>
                <input
                  id="auth-senha"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input has-icon"
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  disabled={loading}
                  required
                  minLength={6}
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn-ghost btn-icon"
                  style={{
                    position: 'absolute',
                    right: '6px',
                    padding: '6px',
                    color: 'var(--text-subtle)',
                    cursor: 'pointer'
                  }}
                  title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  aria-label="Toggle senha"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {!isLogin && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
                  Mínimo de 6 caracteres
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '16px', padding: '0.75rem' }}
              disabled={loading}
              id="auth-submit-btn"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>{isLogin ? 'Entrando...' : 'Criando conta...'}</span>
                </>
              ) : (
                <>
                  <span>{isLogin ? 'Entrar no Sistema' : 'Concluir Cadastro'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security / Trust Badges */}
        <div
          style={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '18px',
            color: 'var(--text-subtle)',
            fontSize: '0.78rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <ShieldCheck size={15} color="var(--success)" />
            <span>Autenticação JWT Segura</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Zap size={15} color="var(--primary)" />
            <span>Senhas com Hash Bcrypt</span>
          </div>
        </div>
      </div>
    </div>
  );
};
