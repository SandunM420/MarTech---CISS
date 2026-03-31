import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type AdminAuthContextValue = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};

const ADMIN_USERNAME = 'Vicha';
const ADMIN_PASSWORD = 'Vicha@123';
const ADMIN_AUTH_STORAGE_KEY = 'admin-authenticated';
const ADMIN_AUTH_EXPIRY_KEY = 'admin-auth-expires-at';
const SESSION_DURATION_MS = 30 * 60 * 1000;

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(ADMIN_AUTH_STORAGE_KEY);
    const storedExpiry = window.localStorage.getItem(ADMIN_AUTH_EXPIRY_KEY);
    const expiresAt = storedExpiry ? Number(storedExpiry) : 0;
    const isSessionValid = storedValue === 'true' && expiresAt > Date.now();

    if (!isSessionValid) {
      window.localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
      window.localStorage.removeItem(ADMIN_AUTH_EXPIRY_KEY);
    }

    setIsAuthenticated(isSessionValid);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      return undefined;
    }

    const storedExpiry = window.localStorage.getItem(ADMIN_AUTH_EXPIRY_KEY);
    const expiresAt = storedExpiry ? Number(storedExpiry) : 0;
    const remainingTime = expiresAt - Date.now();

    if (remainingTime <= 0) {
      window.localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
      window.localStorage.removeItem(ADMIN_AUTH_EXPIRY_KEY);
      setIsAuthenticated(false);
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      window.localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
      window.localStorage.removeItem(ADMIN_AUTH_EXPIRY_KEY);
      setIsAuthenticated(false);
    }, remainingTime);

    return () => window.clearTimeout(timeoutId);
  }, [isAuthenticated]);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      isAuthenticated,
      login: (username, password) => {
        const isValidLogin = username === ADMIN_USERNAME && password === ADMIN_PASSWORD;

        if (isValidLogin) {
          const expiresAt = Date.now() + SESSION_DURATION_MS;
          window.localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, 'true');
          window.localStorage.setItem(ADMIN_AUTH_EXPIRY_KEY, String(expiresAt));
          setIsAuthenticated(true);
        }

        return isValidLogin;
      },
      logout: () => {
        window.localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
        window.localStorage.removeItem(ADMIN_AUTH_EXPIRY_KEY);
        setIsAuthenticated(false);
      },
    }),
    [isAuthenticated],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }

  return context;
}
