// src/contexts/AuthContext.jsx

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/apiClient';
import Loading from '../components/ui/Loading'; // Supondo que você tenha um componente de loading

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | authenticated | unauthenticated

  // Esta função verifica se o usuário tem uma sessão ativa no back-end
  const checkUserStatus = useCallback(async () => {
    try {
      // A rota /profile é protegida. Se funcionar, o cookie é válido.
      const userData = await apiClient('/users/profile');
      setUser(userData);
      setStatus('authenticated');
    } catch (error) {
      // Se der erro 401, é o esperado para um usuário deslogado.
      // Tratamos o erro definindo o estado como não autenticado.
      setUser(null);
      setStatus('unauthenticated');
    }
  }, []);

  // Roda a verificação uma vez quando a aplicação carrega
  useEffect(() => {
    checkUserStatus();
  }, [checkUserStatus]);

  // Função de Login
  const login = async (email, password) => {
    try {
      const userData = await apiClient('/users/login', {
        method: 'POST',
        body: { email, password },
      });
      setUser(userData);
      setStatus('authenticated');
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };
  
  // Função de Registro
  const register = async (name, email, password, phone) => {
    try {
      const userData = await apiClient('/users/register', {
        method: 'POST',
        body: { name, email, password, phone },
      });
      // Após registrar, o back-end já nos loga, então atualizamos o estado
      setUser(userData);
      setStatus('authenticated');
      return { success: true };
    } catch(error) {
      return { success: false, message: error.message };
    }
  }

  // Função de Logout
  const logout = async () => {
    try {
      await apiClient('/users/logout', { method: 'POST' });
    } finally {
      setUser(null);
      setStatus('unauthenticated');
    }
  };

  const value = {
    user,
    setUser,
    isLoggedIn: status === 'authenticated',
    isAdmin: user?.role === 'admin',
    authStatus: status,
    login,
    register,
    logout,
  };
  
  // Mostra um loading geral enquanto a sessão inicial é verificada
  if (status === 'loading') {
    return <Loading size="lg" />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook customizado para facilitar o uso do contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}