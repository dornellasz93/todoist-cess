import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('@taskflow:token'));
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('@taskflow:theme') || 'dark');

  // Aplicar tema no documento HTML
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('@taskflow:theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Validar sessão ao inicializar
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('@taskflow:token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        setUser(response.usuario);
      } catch (error) {
        console.warn('Sessão expirada ou inválida:', error.message);
        localStorage.removeItem('@taskflow:token');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, senha) => {
    const response = await api.post('/auth/login', { email, senha });
    const { usuario, token: newToken } = response;

    localStorage.setItem('@taskflow:token', newToken);
    setToken(newToken);
    setUser(usuario);
    return usuario;
  };

  const register = async (nome, email, senha) => {
    const response = await api.post('/auth/register', { nome, email, senha });
    const { usuario, token: newToken } = response;

    localStorage.setItem('@taskflow:token', newToken);
    setToken(newToken);
    setUser(usuario);
    return usuario;
  };

  const logout = () => {
    localStorage.removeItem('@taskflow:token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        theme,
        toggleTheme
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};
