import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authAPI } from '../services/api';
import type { User } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login:  (email: string, password: string) => Promise<void>;
  logout: () => void;
  setAuth: (token: string, user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser]   = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('mavora_token');
    const storedUser  = localStorage.getItem('mavora_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const setAuth = (tok: string, u: User) => {
    localStorage.setItem('mavora_token', tok);
    localStorage.setItem('mavora_user', JSON.stringify(u));
    setToken(tok);
    setUser(u);
  };

  const login = async (email: string, password: string) => {
    const res = await authAPI.login(email, password);
    setAuth(res.data.token, res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('mavora_token');
    localStorage.removeItem('mavora_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
