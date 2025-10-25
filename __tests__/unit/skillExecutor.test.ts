import {
  executeSkill,
  initializeSkillStates,
  markSkillAsUsed,
  updateSkillAvailability,
  canUseSkill,
} from '@/lib/game/skillExecutor';
import { createEmptyBoard, placeShip } from '@/lib/game/board';
import { CAT_TEAM } from '@/lib/game/characters';
import { getSkillByCharacterId } from '@/lib/game/skills';
import type { Ship } from '@/types';

describe('Skill Executor', () => {
  describe('executeSkill', () => {
    it('範囲攻撃で複数マスを攻撃できる', () => {
      const board = createEmptyBoard();
      const character = CAT_TEAM[0]; // ペルシャ (5マス)
      const placedResult = placeShip(board, character, { x: 4, y: 4 }, 'horizontal');
      expect(placedResult).not.toBeNull();

      const { board: newBoard, ship } = placedResult!;
      const skill = getSkillByCharacterId('persian')!;

      // (5,4)を中心に3×3範囲攻撃 → (4,4)(5,4)(6,4)(7,4)(8,4)のうち(4,4)(5,4)(6,4)がヒット
      const result = executeSkill(skill, { x: 5, y: 4 }, newBoard, [ship]);

      expect(result.results.length).toBeGreaterThan(0);
      const hits = result.results.filter((r) => r.type === 'hit' || r.type === 'sunk');
      expect(hits.length).toBeGreaterThanOrEqual(3);
    });

    it('確実命中スキルは艦船がなくてもヒットになる', () => {
      const board = createEmptyBoard();
      const skill = getSkillByCharacterId('kitten')!;

      const result = executeSkill(skill, { x: 3, y: 3 }, board, []);

      expect(result.results).toHaveLength(1);
      expect(result.results[0].type).toBe('hit');
      expect(result.results[0].shipName).toContain('確実命中');
    });

    it('すでに攻撃済みのマスはスキップされる', () => {
      const board = createEmptyBoard();
      // (3,3)をミス済みにする
      board[3][3] = { ...board[3][3], isMiss: true };

      const skill = getSkillByCharacterId('persian')!;
      const result = executeSkill(skill, { x: 3, y: 3 }, board, []);

      // (3,3)は既に攻撃済みなのでスキップ、周囲8マスのみ
      expect(result.results.length).toBeLessThan(9);
    });
  });

  describe('initializeSkillStates', () => {
    it('艦船からスキル状態を初期化', () => {
      const ships: Ship[] = [
        {
          id: 'ship1',
          characterId: 'persian',
          name: 'ペルシャ猫',
          size: 5,
          team: 'cat',
          positions: [],
          hits: [],
          isSunk: false,
        },
      ];

      const states = initializeSkillStates(ships);

      expect(states).toHaveLength(1);
      expect(states[0].characterId).toBe('persian');
      expect(states[0].skillId).toBe('persian_skill');
      expect(states[0].isUsed).toBe(false);
      expect(states[0].isAvailable).toBe(true);
    });
  });

  describe('markSkillAsUsed', () => {
    it('スキルを使用済みにする', () => {
      const states = [
        {
          characterId: 'persian',
          skillId: 'persian_skill',
          isUsed: false,
          isAvailable: true,
        },
      ];

      const updated = markSkillAsUsed(states, 'persian_skill');

      expect(updated[0].isUsed).toBe(true);
    });

    it('他のスキルには影響しない', () => {
      const states = [
        {
          characterId: 'persian',
          skillId: 'persian_skill',
          isUsed: false,
          isAvailable: true,
        },
        {
          characterId: 'mainecoon',
          skillId: 'mainecoon_skill',
          isUsed: false,
          isAvailable: true,
        },
      ];

      const updated = markSkillAsUsed(states, 'persian_skill');

      expect(updated[0].isUsed).toBe(true);
      expect(updated[1].isUsed).toBe(false);
    });
  });

  describe('updateSkillAvailability', () => {
    it('撃沈された艦船のスキルを無効化', () => {
      const states = [
        {
          characterId: 'persian',
          skillId: 'persian_skill',
          isUsed: false,
          isAvailable: true,
        },
      ];

      const ships: Ship[] = [
        {
          id: 'ship1',
          characterId: 'persian',
          name: 'ペルシャ猫',
          size: 5,
          team: 'cat',
          positions: [],
          hits: [],
          isSunk: true, // 撃沈済み
        },
      ];

      const updated = updateSkillAvailability(states, ships);

      expect(updated[0].isAvailable).toBe(false);
    });

    it('生きている艦船のスキルは有効なまま', () => {
      const states = [
        {
          characterId: 'persian',
          skillId: 'persian_skill',
          isUsed: false,
          isAvailable: true,
        },
      ];

      const ships: Ship[] = [
        {
          id: 'ship1',
          characterId: 'persian',
          name: 'ペルシャ猫',
          size: 5,
          team: 'cat',
          positions: [],
          hits: [],
          isSunk: false,
        },
      ];

      const updated = updateSkillAvailability(states, ships);

      expect(updated[0].isAvailable).toBe(true);
    });
  });

  describe('canUseSkill', () => {
    it('使用可能なスキルはtrueを返す', () => {
      const states = [
        {
          characterId: 'persian',
          skillId: 'persian_skill',
          isUsed: false,
          isAvailable: true,
        },
      ];

      expect(canUseSkill(states, 'persian_skill')).toBe(true);
    });

    it('使用済みのスキルはfalseを返す', () => {
      const states = [
        {
          characterId: 'persian',
          skillId: 'persian_skill',
          isUsed: true,
          isAvailable: true,
        },
      ];

      expect(canUseSkill(states, 'persian_skill')).toBe(false);
    });

    it('無効なスキルはfalseを返す', () => {
      const states = [
        {
          characterId: 'persian',
          skillId: 'persian_skill',
          isUsed: false,
          isAvailable: false,
        },
      ];

      expect(canUseSkill(states, 'persian_skill')).toBe(false);
    });

    it('存在しないスキルはfalseを返す', () => {
      const states = [
        {
          characterId: 'persian',
          skillId: 'persian_skill',
          isUsed: false,
          isAvailable: true,
        },
      ];

      expect(canUseSkill(states, 'nonexistent_skill')).toBe(false);
    });
  });
});
