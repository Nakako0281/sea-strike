import { attack, checkWinner, getUnattackedCells } from '@/lib/game/combat';
import { createEmptyBoard, placeShip } from '@/lib/game/board';
import type { Character, Ship } from '@/types';

const testChar: Character = {
  id: 'test',
  name: 'テスト',
  size: 3,
  team: 'cat',
};

describe('Combat Logic', () => {
  describe('attack', () => {
    it('外れの場合、isMiss: trueを返す', () => {
      const board = createEmptyBoard();
      const result = attack(board, { x: 0, y: 0 }, []);

      expect(result).not.toBeNull();
      expect(result!.result.type).toBe('miss');
      expect(result!.updatedBoard[0][0].isMiss).toBe(true);
    });

    it('命中の場合、isHit: trueとtype: hitを返す', () => {
      const board = createEmptyBoard();
      const placement = placeShip(board, testChar, { x: 0, y: 0 }, 'horizontal');

      const result = attack(placement!.board, { x: 0, y: 0 }, [placement!.ship]);

      expect(result).not.toBeNull();
      expect(result!.result.type).toBe('hit');
      expect(result!.updatedBoard[0][0].isHit).toBe(true);
      expect(result!.updatedShips[0].hits).toHaveLength(1);
    });

    it('撃沈の場合、type: sunkを返す', () => {
      const board = createEmptyBoard();
      const placement = placeShip(board, testChar, { x: 0, y: 0 }, 'horizontal');
      let currentBoard = placement!.board;
      let currentShips = [placement!.ship];

      // 1発目
      const result1 = attack(currentBoard, { x: 0, y: 0 }, currentShips);
      currentBoard = result1!.updatedBoard;
      currentShips = result1!.updatedShips;

      // 2発目
      const result2 = attack(currentBoard, { x: 1, y: 0 }, currentShips);
      currentBoard = result2!.updatedBoard;
      currentShips = result2!.updatedShips;

      // 3発目（撃沈）
      const result3 = attack(currentBoard, { x: 2, y: 0 }, currentShips);

      expect(result3).not.toBeNull();
      expect(result3!.result.type).toBe('sunk');
      expect(result3!.result.shipName).toBe('テスト');
      expect(result3!.updatedShips[0].isSunk).toBe(true);
    });

    it('既に攻撃済みの場所はnullを返す', () => {
      const board = createEmptyBoard();
      const result1 = attack(board, { x: 0, y: 0 }, []);
      const result2 = attack(result1!.updatedBoard, { x: 0, y: 0 }, []);

      expect(result2).toBeNull();
    });

    it('範囲外の場所はnullを返す', () => {
      const board = createEmptyBoard();
      const result = attack(board, { x: -1, y: 0 }, []);

      expect(result).toBeNull();
    });
  });

  describe('checkWinner', () => {
    it('全艦船が撃沈されている場合trueを返す', () => {
      const ships: Ship[] = [
        {
          id: '1',
          characterId: '1',
          name: 'Ship1',
          size: 3,
          team: 'cat',
          positions: [],
          hits: [],
          isSunk: true,
        },
        {
          id: '2',
          characterId: '2',
          name: 'Ship2',
          size: 2,
          team: 'cat',
          positions: [],
          hits: [],
          isSunk: true,
        },
      ];

      expect(checkWinner(ships)).toBe(true);
    });

    it('1隻でも残っている場合falseを返す', () => {
      const ships: Ship[] = [
        {
          id: '1',
          characterId: '1',
          name: 'Ship1',
          size: 3,
          team: 'cat',
          positions: [],
          hits: [],
          isSunk: true,
        },
        {
          id: '2',
          characterId: '2',
          name: 'Ship2',
          size: 2,
          team: 'cat',
          positions: [],
          hits: [],
          isSunk: false,
        },
      ];

      expect(checkWinner(ships)).toBe(false);
    });
  });

  describe('getUnattackedCells', () => {
    it('未攻撃のセルを返す', () => {
      const board = createEmptyBoard();
      const cells = getUnattackedCells(board);

      expect(cells).toHaveLength(100);
    });

    it('攻撃済みのセルは除外される', () => {
      const board = createEmptyBoard();
      const result = attack(board, { x: 0, y: 0 }, []);
      const cells = getUnattackedCells(result!.updatedBoard);

      expect(cells).toHaveLength(99);
    });
  });
});
