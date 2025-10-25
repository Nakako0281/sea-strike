import { switchTurn, canContinue, getNextAttacker } from '@/lib/game/turn';

describe('Turn Management', () => {
  describe('switchTurn', () => {
    it('猫から犬に切り替わる', () => {
      expect(switchTurn('cat')).toBe('dog');
    });

    it('犬から猫に切り替わる', () => {
      expect(switchTurn('dog')).toBe('cat');
    });
  });

  describe('canContinue', () => {
    it('ヒット時はtrueを返す', () => {
      expect(canContinue(true)).toBe(true);
    });

    it('ミス時はfalseを返す', () => {
      expect(canContinue(false)).toBe(false);
    });
  });

  describe('getNextAttacker', () => {
    it('猫がヒットしたら猫が続ける', () => {
      expect(getNextAttacker('cat', true)).toBe('cat');
    });

    it('犬がヒットしたら犬が続ける', () => {
      expect(getNextAttacker('dog', true)).toBe('dog');
    });

    it('猫がミスしたら犬のターン', () => {
      expect(getNextAttacker('cat', false)).toBe('dog');
    });

    it('犬がミスしたら猫のターン', () => {
      expect(getNextAttacker('dog', false)).toBe('cat');
    });
  });
});
