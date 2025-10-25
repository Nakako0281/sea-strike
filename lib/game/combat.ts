import type { Board, Position, Ship, AttackResult } from '@/types';

/**
 * 攻撃処理
 */
export function attack(
  board: Board,
  position: Position,
  ships: Ship[]
): { result: AttackResult; updatedBoard: Board; updatedShips: Ship[] } | null {
  const { x, y } = position;

  // 範囲外チェック
  if (y < 0 || y >= board.length || x < 0 || x >= board[0].length) {
    return null;
  }

  const cell = board[y][x];

  // 既に攻撃済み
  if (cell.isHit || cell.isMiss) {
    return null;
  }

  const newBoard = board.map((row) => row.map((c) => ({ ...c })));
  const newShips = ships.map((s) => ({ ...s, hits: [...s.hits], positions: [...s.positions] }));

  // 外れ
  if (!cell.hasShip) {
    newBoard[y][x] = { ...newBoard[y][x], isMiss: true };

    return {
      result: {
        type: 'miss',
        position,
      },
      updatedBoard: newBoard,
      updatedShips: newShips,
    };
  }

  // 命中
  newBoard[y][x] = { ...newBoard[y][x], isHit: true };

  const shipIndex = newShips.findIndex((s) => s.id === cell.shipId);
  if (shipIndex === -1) {
    return null;
  }

  const ship = newShips[shipIndex];
  ship.hits.push(position);

  // 撃沈チェック
  if (ship.hits.length === ship.size) {
    ship.isSunk = true;

    return {
      result: {
        type: 'sunk',
        position,
        shipId: ship.id,
        shipName: ship.name,
      },
      updatedBoard: newBoard,
      updatedShips: newShips,
    };
  }

  return {
    result: {
      type: 'hit',
      position,
      shipId: ship.id,
    },
    updatedBoard: newBoard,
    updatedShips: newShips,
  };
}

/**
 * 勝敗判定
 */
export function checkWinner(ships: Ship[]): boolean {
  return ships.every((ship) => ship.isSunk);
}

/**
 * 未攻撃のセルを取得
 */
export function getUnattackedCells(board: Board): Position[] {
  const cells: Position[] = [];

  board.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (!cell.isHit && !cell.isMiss) {
        cells.push({ x, y });
      }
    });
  });

  return cells;
}
