'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { register, login, loginAsGuest, logout as authLogout } from '@/lib/supabase/auth';
import type { AuthUser, LoginCredentials, RegisterCredentials } from '@/types';

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  loginAsGuest: (nickname: string) => boolean;
  logout: () => void;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'auth-user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ページロード時にローカルストレージから復元
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Failed to restore user from localStorage:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ユーザー状態をローカルストレージに保存
  const saveUser = (authUser: AuthUser | null) => {
    setUser(authUser);
    if (authUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  // ログイン
  const handleLogin = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { user: authUser, error: authError } = await login(credentials);

      if (authError) {
        setError(authError);
        return false;
      }

      if (authUser) {
        saveUser(authUser);
        return true;
      }

      return false;
    } catch (err) {
      setError('ログイン中にエラーが発生しました');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 新規登録
  const handleRegister = async (credentials: RegisterCredentials): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { user: authUser, error: authError } = await register(credentials);

      if (authError) {
        setError(authError);
        return false;
      }

      if (authUser) {
        saveUser(authUser);
        return true;
      }

      return false;
    } catch (err) {
      setError('登録中にエラーが発生しました');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ゲストログイン
  const handleLoginAsGuest = (nickname: string): boolean => {
    setError(null);

    try {
      const { user: authUser, error: authError } = loginAsGuest(nickname);

      if (authError) {
        setError(authError);
        return false;
      }

      if (authUser) {
        saveUser(authUser);
        return true;
      }

      return false;
    } catch (err) {
      setError('ゲストログイン中にエラーが発生しました');
      return false;
    }
  };

  // ログアウト
  const handleLogout = () => {
    authLogout();
    saveUser(null);
    setError(null);
  };

  // エラークリア
  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    loginAsGuest: handleLoginAsGuest,
    logout: handleLogout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// カスタムフック
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
