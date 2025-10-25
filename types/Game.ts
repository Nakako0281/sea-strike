// ゲーム関連の型定義

export type Position = {
  x: number;
  y: number;
};

export type Team = 'cat' | 'dog';

export type Cell = {
  position: Position;
  hasShip: boolean;
  shipId?: string;
  isHit?: boolean;
  isMiss?: boolean;
};

export type Board = Cell[][];

export type Ship = {
  id: string;
  characterId: string;
  name: string;
  size: number;
  team: Team;
  positions: Position[];
  hits: Position[];
  isSunk: boolean;
};

export type GamePhase = 'setup' | 'battle' | 'finished';

export type Turn = 'player' | 'opponent';

export type AttackResult = {
  type: 'hit' | 'miss' | 'sunk';
  position: Position;
  shipId?: string;
  shipName?: string;
};

export type GameHistoryEntry = {
  turn: number;
  attacker: Turn;
  target: Position;
  result: 'hit' | 'miss' | 'sunk';
};

export type GameState = {
  mode: 'cpu';
  phase: GamePhase;
  currentTurn: Turn;
  turnCount: number;
  playerTeam: Team;
  opponentTeam: Team;
  playerBoard: Board;
  opponentBoard: Board;
  playerShips: Ship[];
  opponentShips: Ship[];
  gameHistory: GameHistoryEntry[];
  winner?: Turn;
};

export type Character = {
  id: string;
  name: string;
  size: number;
  team: Team;
};
