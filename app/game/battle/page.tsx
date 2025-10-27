'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/contexts/GameContext';
import { Grid } from '@/components/game/Grid';
import type { Position, AttackResult } from '@/types';

type BattleLog = {
  id: number;
  message: string;
  type: 'hit' | 'miss' | 'sunk' | 'turn';
  timestamp: number;
};

export default function BattlePage() {
  const router = useRouter();
  const { gameState, attackCell, cpuTurn, resetGame } = useGame();
  const [battleLogs, setBattleLogs] = useState<BattleLog[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);
  const logIdCounter = useRef(0);

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

    if (gameState.currentTurn === 'opponent') {
      addLog('CPUが攻撃を考えています...', 'turn');
      const timer = setTimeout(() => {
        cpuTurn();
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      addLog('あなたのターンです！', 'turn');
    }
  }, [gameState?.currentTurn, gameState?.phase, cpuTurn]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [battleLogs]);

  const addLog = (message: string, type: BattleLog['type']) => {
    setBattleLogs((prev) => [
      ...prev,
      { id: logIdCounter.current++, message, type, timestamp: Date.now() },
    ]);
  };

  if (!gameState) {
    return <div>読み込み中...</div>;
  }

  const handleOpponentCellClick = (position: Position) => {
    if (gameState.phase !== 'battle' || gameState.currentTurn !== 'player') {
      return;
    }

    const result = attackCell(position);
    if (result) {
      if (result.type === 'hit') {
        addLog(`💥 ${result.shipName}に命中！もう一度攻撃できます！`, 'hit');
      } else if (result.type === 'sunk') {
        addLog(`🎯 ${result.shipName}を撃沈！連続攻撃！`, 'sunk');
      } else {
        addLog(`💧 外れ... CPUのターンへ`, 'miss');
      }
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
    <div className="h-screen bg-gradient-to-br from-blue-100 to-green-100 p-4 overflow-hidden">
      <div className="h-full max-w-7xl mx-auto flex flex-col">
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">⚔️ バトル中</h1>

        <div className="bg-white p-3 rounded-xl shadow-md mb-4 text-center">
          <div className="text-lg font-semibold">
            {gameState.currentTurn === 'player' ? (
              <span className="text-blue-600">あなたのターン</span>
            ) : (
              <span className="text-red-600">CPUのターン...</span>
            )}
          </div>
          <div className="text-sm text-gray-600">ターン数: {gameState.turnCount}</div>
        </div>

        <div className="flex-1 flex gap-4 overflow-hidden">
          <div className="flex-1 grid lg:grid-cols-2 gap-4 overflow-auto">
            <div className="bg-white p-4 rounded-xl shadow-xl h-fit">
              <h2 className="text-lg font-semibold mb-3 text-center">
                {gameState.opponentTeam === 'cat' ? '🐱 猫チーム' : '🐕 犬チーム'}の陣地（敵）
              </h2>
              <div className="flex justify-center">
                <Grid
                  board={gameState.opponentBoard}
                  onCellClick={handleOpponentCellClick}
                  showShips={false}
                />
              </div>
              <div className="mt-3 text-center text-sm text-gray-600">
                残り: {gameState.opponentShips.filter((s) => !s.isSunk).length} / {gameState.opponentShips.length} 隻
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-xl h-fit">
              <h2 className="text-lg font-semibold mb-3 text-center">
                {gameState.playerTeam === 'cat' ? '🐱 猫チーム' : '🐕 犬チーム'}の陣地（あなた）
              </h2>
              <div className="flex justify-center">
                <Grid board={gameState.playerBoard} onCellClick={() => {}} showShips={true} />
              </div>
              <div className="mt-3 text-center text-sm text-gray-600">
                残り: {gameState.playerShips.filter((s) => !s.isSunk).length} / {gameState.playerShips.length} 隻
              </div>
            </div>
          </div>

          <div className="w-80 bg-white rounded-xl shadow-xl p-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-3 text-center border-b pb-2">📋 バトルログ</h2>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {battleLogs.length === 0 && (
                <div className="text-center text-gray-400 text-sm mt-8">ログがここに表示されます</div>
              )}
              {battleLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-2 rounded text-sm ${
                    log.type === 'hit'
                      ? 'bg-orange-100 text-orange-800 border-l-4 border-orange-500'
                      : log.type === 'sunk'
                      ? 'bg-red-100 text-red-800 border-l-4 border-red-500'
                      : log.type === 'miss'
                      ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {log.message}
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
            <div className="mt-3 pt-3 border-t">
              <button
                onClick={handleBackToHome}
                className="w-full text-gray-600 hover:text-gray-800 text-sm underline"
              >
                ホームに戻る（ゲーム終了）
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
