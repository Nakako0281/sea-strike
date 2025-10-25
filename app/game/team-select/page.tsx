'use client';

import { useRouter } from 'next/navigation';
import { useGame } from '@/contexts/GameContext';
import type { Team } from '@/types';

export default function TeamSelectPage() {
  const router = useRouter();
  const { startGame } = useGame();

  const handleTeamSelect = (team: Team) => {
    startGame(team);
    router.push('/game/setup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          🎮 チームを選択してください
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 猫チーム */}
          <button
            onClick={() => handleTeamSelect('cat')}
            className="bg-white rounded-xl shadow-2xl p-8 hover:scale-105 transition-transform duration-200 border-4 border-transparent hover:border-orange-400"
          >
            <div className="text-center">
              <div className="text-8xl mb-4">🐱</div>
              <h2 className="text-3xl font-bold text-orange-600 mb-4">猫チーム</h2>
              <p className="text-gray-600 mb-6">
                しなやかな猫たちの軍団
              </p>
              <div className="space-y-2 text-left bg-orange-50 p-4 rounded-lg">
                <p className="text-sm">📦 ペルシャ猫 (5マス)</p>
                <p className="text-sm">📦 メインクーン (4マス)</p>
                <p className="text-sm">📦 アメショー (3マス)</p>
                <p className="text-sm">📦 マンチカン (3マス)</p>
                <p className="text-sm">📦 子猫 (2マス)</p>
              </div>
            </div>
          </button>

          {/* 犬チーム */}
          <button
            onClick={() => handleTeamSelect('dog')}
            className="bg-white rounded-xl shadow-2xl p-8 hover:scale-105 transition-transform duration-200 border-4 border-transparent hover:border-blue-400"
          >
            <div className="text-center">
              <div className="text-8xl mb-4">🐕</div>
              <h2 className="text-3xl font-bold text-blue-600 mb-4">犬チーム</h2>
              <p className="text-gray-600 mb-6">
                忠実な犬たちの軍団
              </p>
              <div className="space-y-2 text-left bg-blue-50 p-4 rounded-lg">
                <p className="text-sm">📦 ゴールデン (5マス)</p>
                <p className="text-sm">📦 柴犬 (4マス)</p>
                <p className="text-sm">📦 コーギー (3マス)</p>
                <p className="text-sm">📦 ビーグル (3マス)</p>
                <p className="text-sm">📦 チワワ (2マス)</p>
              </div>
            </div>
          </button>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/home')}
            className="text-gray-600 hover:text-gray-800 underline"
          >
            ← ホームに戻る
          </button>
        </div>
      </div>
    </div>
  );
}
