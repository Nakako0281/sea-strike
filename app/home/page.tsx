'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-blue-600">🌊 SEA STRIKE</h1>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                ログアウト
              </button>
            </div>

            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-lg">
                ようこそ、<span className="font-bold text-blue-600">{user.nickname}</span>さん！
                {user.isGuest && <span className="ml-2 text-sm text-gray-500">(ゲスト)</span>}
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => router.push('/game/team-select')}
                className="w-full bg-blue-500 text-white py-4 px-6 rounded-lg hover:bg-blue-600 transition text-lg font-semibold shadow-md"
              >
                🤖 CPU対戦
              </button>

              <div className="space-y-2">
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 py-4 px-6 rounded-lg cursor-not-allowed text-lg font-semibold"
                >
                  🌐 オンライン対戦（準備中）
                </button>
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 py-4 px-6 rounded-lg cursor-not-allowed text-lg font-semibold"
                >
                  ⚙️ 設定（準備中）
                </button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-center text-gray-500">
                現在はCPU対戦のみプレイ可能です
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
