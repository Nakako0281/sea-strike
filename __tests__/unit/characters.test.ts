import { CAT_TEAM, DOG_TEAM, getTeamCharacters, getTotalShipCells } from '@/lib/game/characters';

describe('Characters', () => {
  describe('CAT_TEAM', () => {
    it('猫チームは5種類のキャラクターを持つ', () => {
      expect(CAT_TEAM).toHaveLength(5);
    });

    it('すべてのキャラクターがteam: catを持つ', () => {
      CAT_TEAM.forEach((char) => {
        expect(char.team).toBe('cat');
      });
    });

    it('正しいサイズ構成になっている', () => {
      const sizes = CAT_TEAM.map((c) => c.size).sort((a, b) => b - a);
      expect(sizes).toEqual([5, 4, 3, 3, 2]);
    });

    it('合計17マスになる', () => {
      const total = CAT_TEAM.reduce((sum, c) => sum + c.size, 0);
      expect(total).toBe(17);
    });
  });

  describe('DOG_TEAM', () => {
    it('犬チームは5種類のキャラクターを持つ', () => {
      expect(DOG_TEAM).toHaveLength(5);
    });

    it('すべてのキャラクターがteam: dogを持つ', () => {
      DOG_TEAM.forEach((char) => {
        expect(char.team).toBe('dog');
      });
    });

    it('正しいサイズ構成になっている', () => {
      const sizes = DOG_TEAM.map((c) => c.size).sort((a, b) => b - a);
      expect(sizes).toEqual([5, 4, 3, 3, 2]);
    });

    it('合計17マスになる', () => {
      const total = DOG_TEAM.reduce((sum, c) => sum + c.size, 0);
      expect(total).toBe(17);
    });
  });

  describe('getTeamCharacters', () => {
    it('猫チームのキャラクターを取得できる', () => {
      const chars = getTeamCharacters('cat');
      expect(chars).toEqual(CAT_TEAM);
      expect(chars).toHaveLength(5);
    });

    it('犬チームのキャラクターを取得できる', () => {
      const chars = getTeamCharacters('dog');
      expect(chars).toEqual(DOG_TEAM);
      expect(chars).toHaveLength(5);
    });
  });

  describe('getTotalShipCells', () => {
    it('猫チームの合計マス数を取得できる', () => {
      expect(getTotalShipCells('cat')).toBe(17);
    });

    it('犬チームの合計マス数を取得できる', () => {
      expect(getTotalShipCells('dog')).toBe(17);
    });
  });
});
