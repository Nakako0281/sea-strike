import {
  createEmptyBoard,
  canPlaceShip,
  placeShip,
  randomPlacement,
  isValidPosition,
  GRID_SIZE,
} from '@/lib/game/board';
import { CAT_TEAM } from '@/lib/game/characters';
import type { Character } from '@/types';

const testCharacter: Character = {
  id: 'test',
  name: 'テストキャラ',
  size: 3,
  team: 'cat',
};

describe('Board Logic', () => {
  describe('createEmptyBoard', () => {
    it('10x10の空盤面を作成する', () => {
      const board = createEmptyBoard();

      expect(board).toHaveLength(GRID_SIZE);
      board.forEach((row) => {
        expect(row).toHaveLength(GRID_SIZE);
      });
    });

    it('すべてのセルがhasShip: falseである', () => {
      const board = createEmptyBoard();

      board.forEach((row) => {
        row.forEach((cell) => {
          expect(cell.hasShip).toBe(false);
        });
      });
    });
  });

  describe('isValidPosition', () => {
    it('有効な座標でtrueを返す', () => {
      expect(isValidPosition({ x: 0, y: 0 })).toBe(true);
      expect(isValidPosition({ x: 5, y: 5 })).toBe(true);
      expect(isValidPosition({ x: 9, y: 9 })).toBe(true);
    });

    it('無効な座標でfalseを返す', () => {
      expect(isValidPosition({ x: -1, y: 0 })).toBe(false);
      expect(isValidPosition({ x: 0, y: -1 })).toBe(false);
      expect(isValidPosition({ x: 10, y: 0 })).toBe(false);
      expect(isValidPosition({ x: 0, y: 10 })).toBe(false);
    });
  });

  describe('canPlaceShip', () => {
    let board = createEmptyBoard();

    beforeEach(() => {
      board = createEmptyBoard();
    });

    it('水平方向に配置可能な場合trueを返す', () => {
      const result = canPlaceShip(board, testCharacter, { x: 0, y: 0 }, 'horizontal');
      expect(result).toBe(true);
    });

    it('垂直方向に配置可能な場合trueを返す', () => {
      const result = canPlaceShip(board, testCharacter, { x: 0, y: 0 }, 'vertical');
      expect(result).toBe(true);
    });

    it('範囲外になる場合falseを返す（水平）', () => {
      const result = canPlaceShip(board, testCharacter, { x: 8, y: 0 }, 'horizontal');
      expect(result).toBe(false);
    });

    it('範囲外になる場合falseを返す（垂直）', () => {
      const result = canPlaceShip(board, testCharacter, { x: 0, y: 8 }, 'vertical');
      expect(result).toBe(false);
    });

    it('既存の艦船と重複する場合falseを返す', () => {
      const placedResult = placeShip(board, testCharacter, { x: 0, y: 0 }, 'horizontal');
      const result = canPlaceShip(placedResult!.board, testCharacter, { x: 1, y: 0 }, 'horizontal');
      expect(result).toBe(false);
    });
  });

  describe('placeShip', () => {
    let board = createEmptyBoard();

    beforeEach(() => {
      board = createEmptyBoard();
    });

    it('艦船を正しく配置する（水平）', () => {
      const result = placeShip(board, testCharacter, { x: 0, y: 0 }, 'horizontal');

      expect(result).not.toBeNull();
      expect(result!.ship.positions).toHaveLength(3);
      expect(result!.ship.positions).toEqual([
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
      ]);
    });

    it('艦船を正しく配置する（垂直）', () => {
      const result = placeShip(board, testCharacter, { x: 0, y: 0 }, 'vertical');

      expect(result).not.toBeNull();
      expect(result!.ship.positions).toHaveLength(3);
      expect(result!.ship.positions).toEqual([
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: 2 },
      ]);
    });

    it('配置不可の場合nullを返す', () => {
      const result = placeShip(board, testCharacter, { x: 8, y: 0 }, 'horizontal');
      expect(result).toBeNull();
    });

    it('盤面に艦船情報が設定される', () => {
      const result = placeShip(board, testCharacter, { x: 0, y: 0 }, 'horizontal');

      expect(result!.board[0][0].hasShip).toBe(true);
      expect(result!.board[0][0].shipId).toBe('test');
      expect(result!.board[0][1].hasShip).toBe(true);
      expect(result!.board[0][2].hasShip).toBe(true);
    });
  });

  describe('randomPlacement', () => {
    it('すべての艦船を配置する', () => {
      const { board, ships } = randomPlacement(CAT_TEAM);

      expect(ships).toHaveLength(5);
      expect(ships.map((s) => s.size).sort()).toEqual([2, 3, 3, 4, 5]);
    });

    it('艦船が重複していない', () => {
      const { board } = randomPlacement(CAT_TEAM);

      let shipCount = 0;
      board.forEach((row) => {
        row.forEach((cell) => {
          if (cell.hasShip) shipCount++;
        });
      });

      expect(shipCount).toBe(17); // 2+3+3+4+5
    });

    it('同じ呼び出しで異なる配置が生成される', () => {
      const result1 = randomPlacement(CAT_TEAM);
      const result2 = randomPlacement(CAT_TEAM);

      // 完全に同じ配置になることはほぼない
      const positions1 = JSON.stringify(result1.ships.map((s) => s.positions));
      const positions2 = JSON.stringify(result2.ships.map((s) => s.positions));

      // 同じになる確率は極めて低い
      expect(positions1).not.toBe(positions2);
    });
  });
});
