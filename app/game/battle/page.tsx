'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/contexts/GameContext';
import { Grid } from '@/components/game/Grid';
import type { Position, AttackResult } from '@/types';

export default function BattlePage() {
  const router = useRouter();
  const { gameState, attackCell, cpuTurn, resetGame } = useGame();
  const [lastResult, setLastResult] = useState<AttackResult | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!gameState) {
      router.push('/game/team-select');
      return;
    }

    if (gameState.phase !== 'battle' && gameState.phase !== 'finished') {
      router.push('/game/setup');
      return;
    }
  }, [gameState, router]);

  useEffect(() => {
    if (!gameState || gameState.phase !== 'battle') return;

    // CPUのターンの場合、自動的に攻撃
    if (gameState.currentTurn === 'opponent') {
      const timer = setTimeout(() => {
        cpuTurn();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState, cpuTurn]);

  if (!gameState) {
    return <div>読み込み中...</div>;
  }

  const handleOpponentCellClick = (position: Position) => {
    if (gameState.phase !== 'battle' || gameState.currentTurn !== 'player') {
      return;
    }

    const result = attackCell(position);
    if (result) {
      setLastResult(result);
      if (result.type === 'hit') {
        setMessage(`${result.shipName}に命中！もう一度攻撃できます！`);
      } else if (result.type === 'sunk') {
        setMessage(`${result.shipName}を撃沈！連続攻撃！`);
      } else {
        setMessage('外れ...CPUのターンです');
      }

      setTimeout(() => setMessage(''), 2000);
    }
  };

  const handleBackToHome = () => {
    resetGame();
    router.push('/home');
  };

  if (gameState.phase === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 p-4 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md">
          <h1 className="text-4xl font-bold mb-6">
            {gameState.winner === 'player' ? '🎉 勝利！' : '💀 敗北...'}
          </h1>
          <p className="text-xl mb-4">
            {gameState.winner === 'player'
              ? '全ての敵艦を撃沈しました！'
              : 'すべての艦船が撃沈されました...'}
          </p>
          <p className="text-gray-600 mb-6">ターン数: {gameState.turnCount}</p>
          <button
            onClick={handleBackToHome}
            className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition"
          >
            ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">⚔️ バトル中</h1>

        {/* ターン表示 */}
        <div className="bg-white p-4 rounded-xl shadow-md mb-6 text-center">
          <div className="text-lg font-semibold">
            {gameState.currentTurn === 'player' ? (
              <span className="text-blue-600">あなたのターン</span>
            ) : (
              <span className="text-red-600">CPUのターン...</span>
            )}
          </div>
          <div className="text-sm text-gray-600 mt-1">ターン数: {gameState.turnCount}</div>
          {message && <div className="mt-2 text-purple-600 font-semibold">{message}</div>}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 敵の盤面 */}
          <div className="bg-white p-6 rounded-xl shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-center">
              {gameState.opponentTeam === 'cat' ? '🐱 猫チーム' : '🐕 犬チーム'}の陣地（敵）
            </h2>
            <div className="flex justify-center">
              <Grid
                board={gameState.opponentBoard}
                onCellClick={handleOpponentCellClick}
                showShips={false}
              />
            </div>
            <div className="mt-4 text-center text-sm text-gray-600">
              残り: {gameState.opponentShips.filter((s) => !s.isSunk).length} /{' '}
              {gameState.opponentShips.length} 隻
            </div>
          </div>

          {/* 自分の盤面 */}
          <div className="bg-white p-6 rounded-xl shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-center">
              {gameState.playerTeam === 'cat' ? '🐱 猫チーム' : '🐕 犬チーム'}の陣地（あなた）
            </h2>
            <div className="flex justify-center">
              <Grid board={gameState.playerBoard} onCellClick={() => {}} showShips={true} />
            </div>
            <div className="mt-4 text-center text-sm text-gray-600">
              残り: {gameState.playerShips.filter((s) => !s.isSunk).length} /{' '}
              {gameState.playerShips.length} 隻
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={handleBackToHome}
            className="text-gray-600 hover:text-gray-800 underline"
          >
            ホームに戻る（ゲーム終了）
          </button>
        </div>
      </div>
    </div>
  );
}
