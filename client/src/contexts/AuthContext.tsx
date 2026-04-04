import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { api } from '../lib/api';
import {
  AUTH_STATE_CHANGE_EVENT,
  clearStoredAuth,
  getStoredToken,
  getStoredUser,
  setStoredAuth,
  type AuthUser,
} from '../lib/auth';

type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  isAuthenticated: boolean;
  refreshAuth: () => Promise<void>;
  login: (input: { email: string; password: string }) => Promise<AuthUser>;
  register: (input: { name: string; email: string; password: string }) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<AuthUser | null>(getStoredUser());

  const refreshAuth = useCallback(async () => {
    const token = getStoredToken();

    if (!token) {
      setUser(null);
      setStatus('anonymous');
      return;
    }

    try {
      const response = await api.get<{ user: AuthUser }>('/auth/me');
      setStoredAuth(token, response.data.user);
      setUser(response.data.user);
      setStatus('authenticated');
    } catch {
      clearStoredAuth();
      setUser(null);
      setStatus('anonymous');
    }
  }, []);

  useEffect(() => {
    void refreshAuth();

    const handleAuthChange = () => {
      void refreshAuth();
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'token' || event.key === 'user' || event.key === null) {
        void refreshAuth();
      }
    };

    window.addEventListener(AUTH_STATE_CHANGE_EVENT, handleAuthChange);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(AUTH_STATE_CHANGE_EVENT, handleAuthChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, [refreshAuth]);

  const login = useCallback(async ({ email, password }: { email: string; password: string }) => {
    const response = await api.post<{ token: string; user: AuthUser }>('/auth/login', {
      email: email.trim(),
      password,
    });

    setStoredAuth(response.data.token, response.data.user);
    setUser(response.data.user);
    setStatus('authenticated');

    return response.data.user;
  }, []);

  const register = useCallback(
    async ({ name, email, password }: { name: string; email: string; password: string }) => {
      const response = await api.post<{ token: string; user: AuthUser }>('/auth/register', {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      setStoredAuth(response.data.token, response.data.user);
      setUser(response.data.user);
      setStatus('authenticated');

      return response.data.user;
    },
    []
  );

  const logout = useCallback(() => {
    clearStoredAuth();
    setUser(null);
    setStatus('anonymous');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      isAuthenticated: status === 'authenticated',
      refreshAuth,
      login,
      register,
      logout,
    }),
    [status, user, refreshAuth, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
