'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register' | 'guest'>('login');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const { login, register, loginAsGuest, error, loading, clearError } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    let success = false;

    if (mode === 'guest') {
      success = loginAsGuest(nickname);
    } else if (mode === 'register') {
      success = await register({ nickname, password });
    } else {
      success = await login({ nickname, password });
    }

    if (success) {
      router.push('/home');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          🌊 SEA STRIKE 🌊
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
              ニックネーム
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ニックネームを入力"
              required
              disabled={loading}
            />
          </div>

          {mode !== 'guest' && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="パスワードを入力"
                required
                disabled={loading}
              />
            </div>
          )}

          <div className="flex gap-2">
            {mode !== 'guest' && (
              <>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  {loading ? '処理中...' : mode === 'login' ? 'ログイン' : '新規登録'}
                </button>
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  disabled={loading}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  {mode === 'login' ? '新規登録' : 'ログイン'}
                </button>
              </>
            )}
            {mode === 'guest' && (
              <>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  {loading ? '処理中...' : 'ゲストで始める'}
                </button>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  disabled={loading}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  戻る
                </button>
              </>
            )}
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => {
              setMode('guest');
              setPassword('');
              clearError();
            }}
            disabled={loading || mode === 'guest'}
            className="w-full bg-green-100 text-green-700 py-2 px-4 rounded-md hover:bg-green-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition"
          >
            🎮 ゲストとしてプレイ
          </button>
        </div>

        <p className="mt-4 text-xs text-center text-gray-500">
          {mode === 'login' && 'アカウントをお持ちでない方は「新規登録」をクリック'}
          {mode === 'register' && 'すでにアカウントをお持ちの方は「ログイン」をクリック'}
          {mode === 'guest' && 'ゲストプレイではデータは保存されません'}
        </p>
      </div>
    </div>
  );
}
