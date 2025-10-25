'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { createEmptyBoard, randomPlacement } from '@/lib/game/board';
import { getTeamCharacters } from '@/lib/game/characters';
import type { GameState, Team, Board, Ship, GamePhase } from '@/types';

type GameContextType = {
  gameState: GameState | null;
  startGame: (playerTeam: Team) => void;
  setPlayerBoard: (board: Board, ships: Ship[]) => void;
  randomPlaceShips: () => void;
  goToBattle: () => void;
  resetGame: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState | null>(null);

  // ゲーム開始
  const startGame = (playerTeam: Team) => {
    const opponentTeam: Team = playerTeam === 'cat' ? 'dog' : 'cat';
    const opponentCharacters = getTeamCharacters(opponentTeam);
    const { board: opponentBoard, ships: opponentShips } = randomPlacement(opponentCharacters);

    setGameState({
      mode: 'cpu',
      phase: 'setup',
      currentTurn: 'player',
      turnCount: 0,
      playerTeam,
      opponentTeam,
      playerBoard: createEmptyBoard(),
      opponentBoard,
      playerShips: [],
      opponentShips,
      gameHistory: [],
    });
  };

  // プレイヤーの盤面設定
  const setPlayerBoard = (board: Board, ships: Ship[]) => {
    if (!gameState) return;

    setGameState({
      ...gameState,
      playerBoard: board,
      playerShips: ships,
    });
  };

  // ランダム配置
  const randomPlaceShips = () => {
    if (!gameState) return;

    const playerCharacters = getTeamCharacters(gameState.playerTeam);
    const { board, ships } = randomPlacement(playerCharacters);

    setGameState({
      ...gameState,
      playerBoard: board,
      playerShips: ships,
    });
  };

  // バトル画面へ
  const goToBattle = () => {
    if (!gameState) return;

    setGameState({
      ...gameState,
      phase: 'battle',
    });
  };

  // ゲームリセット
  const resetGame = () => {
    setGameState(null);
  };

  const value: GameContextType = {
    gameState,
    startGame,
    setPlayerBoard,
    randomPlaceShips,
    goToBattle,
    resetGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
