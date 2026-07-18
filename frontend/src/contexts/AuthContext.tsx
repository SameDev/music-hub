import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { apiFetch, AUTH_LOGOUT_EVENT } from '../lib/api';
import { authStorage } from '../lib/authStorage';

interface TokensResponse {
  accessToken: string;
  refreshToken: string;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(authStorage.getAccessToken()));

  useEffect(() => {
    const handleLogout = () => setIsAuthenticated(false);
    window.addEventListener(AUTH_LOGOUT_EVENT, handleLogout);
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, handleLogout);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const tokens = await apiFetch<TokensResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    authStorage.setTokens(tokens.accessToken, tokens.refreshToken);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiFetch<void>('/auth/logout', { method: 'POST' });
    } catch {
      // best effort — clear local state regardless
    }
    authStorage.clear();
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
