'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { createEmptyBoard, randomPlacement } from '@/lib/game/board';
import { getTeamCharacters } from '@/lib/game/characters';
import { attack, checkWinner, getUnattackedCells } from '@/lib/game/combat';
import { getNextAttacker } from '@/lib/game/turn';
import type { GameState, Team, Board, Ship, GamePhase, Position, AttackResult } from '@/types';

type GameContextType = {
  gameState: GameState | null;
  startGame: (playerTeam: Team) => void;
  setPlayerBoard: (board: Board, ships: Ship[]) => void;
  randomPlaceShips: () => void;
  goToBattle: () => void;
  resetGame: () => void;
  attackCell: (position: Position) => AttackResult | null;
  cpuTurn: () => void;
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

  // プレイヤーが攻撃
  const attackCell = (position: Position): AttackResult | null => {
    if (!gameState || gameState.phase !== 'battle' || gameState.currentTurn !== 'player') {
      return null;
    }

    const result = attack(gameState.opponentBoard, position, gameState.opponentShips);
    if (!result) return null;

    const { result: attackResult, updatedBoard, updatedShips } = result;

    // ゲーム履歴に追加
    const newHistory = [
      ...gameState.gameHistory,
      {
        turn: gameState.turnCount + 1,
        attacker: 'player' as const,
        target: position,
        result: attackResult.type,
      },
    ];

    // 勝敗判定
    const isOpponentDefeated = checkWinner(updatedShips);
    const newPhase: GamePhase = isOpponentDefeated ? 'finished' : 'battle';

    // 次の攻撃者を決定 (ヒットなら連続攻撃、ミスならターン交代)
    const wasHit = attackResult.type === 'hit' || attackResult.type === 'sunk';
    const nextTurn = wasHit ? 'player' : 'opponent';

    setGameState({
      ...gameState,
      opponentBoard: updatedBoard,
      opponentShips: updatedShips,
      gameHistory: newHistory,
      currentTurn: nextTurn,
      turnCount: gameState.turnCount + 1,
      phase: newPhase,
      winner: isOpponentDefeated ? 'player' : undefined,
    });

    return attackResult;
  };

  // CPUの攻撃
  const cpuTurn = () => {
    if (!gameState || gameState.phase !== 'battle' || gameState.currentTurn !== 'opponent') {
      return;
    }

    // ランダムに未攻撃のマスを選択
    const unattackedCells = getUnattackedCells(gameState.playerBoard);
    if (unattackedCells.length === 0) return;

    const randomIndex = Math.floor(Math.random() * unattackedCells.length);
    const targetPosition = unattackedCells[randomIndex];

    const result = attack(gameState.playerBoard, targetPosition, gameState.playerShips);
    if (!result) return;

    const { result: attackResult, updatedBoard, updatedShips } = result;

    // ゲーム履歴に追加
    const newHistory = [
      ...gameState.gameHistory,
      {
        turn: gameState.turnCount + 1,
        attacker: 'opponent' as const,
        target: targetPosition,
        result: attackResult.type,
      },
    ];

    // 勝敗判定
    const isPlayerDefeated = checkWinner(updatedShips);
    const newPhase: GamePhase = isPlayerDefeated ? 'finished' : 'battle';

    // 次の攻撃者を決定 (ヒットなら連続攻撃、ミスならターン交代)
    const wasHit = attackResult.type === 'hit' || attackResult.type === 'sunk';
    const nextTurn = wasHit ? 'opponent' : 'player';

    setGameState({
      ...gameState,
      playerBoard: updatedBoard,
      playerShips: updatedShips,
      gameHistory: newHistory,
      currentTurn: nextTurn,
      turnCount: gameState.turnCount + 1,
      phase: newPhase,
      winner: isPlayerDefeated ? 'opponent' : undefined,
    });
  };

  const value: GameContextType = {
    gameState,
    startGame,
    setPlayerBoard,
    randomPlaceShips,
    goToBattle,
    resetGame,
    attackCell,
    cpuTurn,
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
