'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/contexts/GameContext';
import { Grid } from '@/components/game/Grid';
import { getTeamCharacters } from '@/lib/game/characters';
import { placeShip } from '@/lib/game/board';
import type { Character, Board, Ship } from '@/types';

export default function SetupPage() {
  const router = useRouter();
  const { gameState, setPlayerBoard, randomPlaceShips, goToBattle } = useGame();
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [placedShips, setPlacedShips] = useState<Ship[]>([]);
  const [board, setBoard] = useState<Board | null>(null);

  useEffect(() => {
    if (!gameState) {
      router.push('/game/team-select');
      return;
    }

    if (gameState.phase !== 'setup') {
      router.push('/game/battle');
      return;
    }

    setBoard(gameState.playerBoard);
    setPlacedShips(gameState.playerShips);
  }, [gameState, router]);

  if (!gameState || !board) {
    return <div>読み込み中...</div>;
  }

  const characters = getTeamCharacters(gameState.playerTeam);
  const allPlaced = placedShips.length === characters.length;

  const handleCellClick = (position: { x: number; y: number }) => {
    if (!selectedCharacter || placedShips.some((s) => s.id === selectedCharacter.id)) {
      return;
    }

    const result = placeShip(board, selectedCharacter, position, orientation);

    if (result) {
      setBoard(result.board);
      setPlacedShips([...placedShips, result.ship]);
      setPlayerBoard(result.board, [...placedShips, result.ship]);
      setSelectedCharacter(null);
    }
  };

  const handleRandomPlace = () => {
    randomPlaceShips();
    setSelectedCharacter(null);
  };

  const handleStartBattle = () => {
    goToBattle();
    router.push('/game/battle');
  };

  const isPlaced = (charId: string) => placedShips.some((s) => s.id === charId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          📦 艦船を配置してください
        </h1>

        <div className="grid lg:grid-cols-[1fr_auto] gap-8">
          {/* 左側: グリッド */}
          <div className="bg-white p-6 rounded-xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {gameState.playerTeam === 'cat' ? '🐱 猫チーム' : '🐕 犬チーム'}の陣地
              </h2>
              <div className="space-x-2">
                <button
                  onClick={() => setOrientation(orientation === 'horizontal' ? 'vertical' : 'horizontal')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                  回転: {orientation === 'horizontal' ? '横 →' : '縦 ↓'}
                </button>
                <button
                  onClick={handleRandomPlace}
                  className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
                >
                  🎲 ランダム配置
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <Grid board={board} onCellClick={handleCellClick} showShips={true} />
            </div>

            {selectedCharacter && (
              <p className="mt-4 text-center text-sm text-gray-600">
                配置中: <span className="font-bold text-blue-600">{selectedCharacter.name}</span> ({selectedCharacter.size}マス)
                - グリッドをクリックして配置
              </p>
            )}
          </div>

          {/* 右側: キャラクターリスト */}
          <div className="bg-white p-6 rounded-xl shadow-xl lg:w-80">
            <h3 className="text-lg font-semibold mb-4">配置するキャラクター</h3>

            <div className="space-y-2 mb-6">
              {characters.map((char) => {
                const placed = isPlaced(char.id);
                const selected = selectedCharacter?.id === char.id;

                return (
                  <button
                    key={char.id}
                    onClick={() => !placed && setSelectedCharacter(char)}
                    disabled={placed}
                    className={`
                      w-full p-3 rounded-lg border-2 text-left transition
                      ${placed ? 'bg-green-100 border-green-400 cursor-not-allowed' : ''}
                      ${selected ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 border-gray-300 hover:bg-gray-100'}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{char.name}</p>
                        <p className="text-sm text-gray-600">{char.size}マス</p>
                      </div>
                      <div className="text-2xl">
                        {placed ? '✅' : selected ? '👉' : '📦'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-4">
                配置済み: {placedShips.length} / {characters.length}
              </p>

              <button
                onClick={handleStartBattle}
                disabled={!allPlaced}
                className={`
                  w-full py-3 px-4 rounded-lg font-semibold transition
                  ${allPlaced ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                `}
              >
                {allPlaced ? '⚔️ バトル開始！' : '全て配置してください'}
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/game/team-select')}
            className="text-gray-600 hover:text-gray-800 underline"
          >
            ← チーム選択に戻る
          </button>
        </div>
      </div>
    </div>
  );
}
