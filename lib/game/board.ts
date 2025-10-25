import type { Board, Cell, Position, Ship, Character } from '@/types';

export const GRID_SIZE = 10;

/**
 * 空の盤面を作成
 */
export function createEmptyBoard(): Board {
  const board: Board = [];

  for (let y = 0; y < GRID_SIZE; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      row.push({
        position: { x, y },
        hasShip: false,
      });
    }
    board.push(row);
  }

  return board;
}

/**
 * 艦船が配置可能かチェック
 */
export function canPlaceShip(
  board: Board,
  character: Character,
  startPos: Position,
  orientation: 'horizontal' | 'vertical'
): boolean {
  const { size } = character;
  const { x, y } = startPos;

  // 範囲外チェック
  if (orientation === 'horizontal') {
    if (x + size > GRID_SIZE) return false;
  } else {
    if (y + size > GRID_SIZE) return false;
  }

  // 重複チェック
  for (let i = 0; i < size; i++) {
    const checkX = orientation === 'horizontal' ? x + i : x;
    const checkY = orientation === 'vertical' ? y + i : y;

    if (board[checkY][checkX].hasShip) {
      return false;
    }
  }

  return true;
}

/**
 * 艦船を配置
 */
export function placeShip(
  board: Board,
  character: Character,
  startPos: Position,
  orientation: 'horizontal' | 'vertical'
): { board: Board; ship: Ship } | null {
  if (!canPlaceShip(board, character, startPos, orientation)) {
    return null;
  }

  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
  const positions: Position[] = [];
  const { size, id, name, team } = character;
  const { x, y } = startPos;

  for (let i = 0; i < size; i++) {
    const cellX = orientation === 'horizontal' ? x + i : x;
    const cellY = orientation === 'vertical' ? y + i : y;

    newBoard[cellY][cellX] = {
      ...newBoard[cellY][cellX],
      hasShip: true,
      shipId: id,
    };

    positions.push({ x: cellX, y: cellY });
  }

  const ship: Ship = {
    id,
    characterId: id,
    name,
    size,
    team,
    positions,
    hits: [],
    isSunk: false,
  };

  return { board: newBoard, ship };
}

/**
 * ランダムに艦船を配置
 */
export function randomPlacement(characters: Character[]): { board: Board; ships: Ship[] } {
  let board = createEmptyBoard();
  const ships: Ship[] = [];

  // サイズの大きい順に配置（配置しやすくするため）
  const sortedCharacters = [...characters].sort((a, b) => b.size - a.size);

  for (const character of sortedCharacters) {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;

    while (!placed && attempts < maxAttempts) {
      const x = Math.floor(Math.random() * GRID_SIZE);
      const y = Math.floor(Math.random() * GRID_SIZE);
      const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';

      const result = placeShip(board, character, { x, y }, orientation);

      if (result) {
        board = result.board;
        ships.push(result.ship);
        placed = true;
      }

      attempts++;
    }

    if (!placed) {
      // 配置失敗時は最初からやり直し
      return randomPlacement(characters);
    }
  }

  return { board, ships };
}

/**
 * 座標が盤面内かチェック
 */
export function isValidPosition(pos: Position): boolean {
  return pos.x >= 0 && pos.x < GRID_SIZE && pos.y >= 0 && pos.y < GRID_SIZE;
}
