import { cpuThinkEasy, getCPUThinkingTime } from '@/lib/game/ai';
import { createEmptyBoard } from '@/lib/game/board';

describe('CPU AI', () => {
  describe('cpuThinkEasy', () => {
    it('攻撃アクションを返す', () => {
      const board = createEmptyBoard();
      const skillStates = [
        { characterId: 'persian', skillId: 'persian_skill', isUsed: false, isAvailable: true },
      ];

      const action = cpuThinkEasy(board, skillStates, 'cat');

      expect(action).toHaveProperty('type');
      expect(action).toHaveProperty('target');
      expect(action.target.x).toBeGreaterThanOrEqual(0);
      expect(action.target.x).toBeLessThan(10);
      expect(action.target.y).toBeGreaterThanOrEqual(0);
      expect(action.target.y).toBeLessThan(10);
    });

    it('使用可能なスキルがある場合、スキルを選択することがある', () => {
      const board = createEmptyBoard();
      const skillStates = [
        { characterId: 'persian', skillId: 'persian_skill', isUsed: false, isAvailable: true },
      ];

      // 複数回試行してスキル使用が発生するかチェック
      let hasSkillAction = false;
      for (let i = 0; i < 100; i++) {
        const action = cpuThinkEasy(board, skillStates, 'cat');
        if (action.type === 'skill') {
          hasSkillAction = true;
          expect(action.skillId).toBe('persian_skill');
          break;
        }
      }

      // 20%の確率なので100回中1回は発生するはず
      expect(hasSkillAction).toBe(true);
    });

    it('使用可能なスキルがない場合は通常攻撃のみ', () => {
      const board = createEmptyBoard();
      const skillStates = [
        { characterId: 'persian', skillId: 'persian_skill', isUsed: true, isAvailable: true },
      ];

      for (let i = 0; i < 10; i++) {
        const action = cpuThinkEasy(board, skillStates, 'cat');
        expect(action.type).toBe('attack');
      }
    });

    it('一列攻撃スキルの場合は方向が指定される', () => {
      const board = createEmptyBoard();
      const skillStates = [
        { characterId: 'mainecoon', skillId: 'mainecoon_skill', isUsed: false, isAvailable: true },
      ];

      // 複数回試行してスキル使用が発生するまで
      for (let i = 0; i < 200; i++) {
        const action = cpuThinkEasy(board, skillStates, 'cat');
        if (action.type === 'skill' && action.skillId === 'mainecoon_skill') {
          expect(action.direction).toBeDefined();
          expect(['horizontal', 'vertical']).toContain(action.direction);
          break;
        }
      }
    });
  });

  describe('getCPUThinkingTime', () => {
    it('1-2秒の範囲で思考時間を返す', () => {
      const time = getCPUThinkingTime();
      expect(time).toBeGreaterThanOrEqual(1000);
      expect(time).toBeLessThanOrEqual(2000);
    });
  });
});
