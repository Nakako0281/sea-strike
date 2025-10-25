import {
  CAT_SKILLS,
  DOG_SKILLS,
  getTeamSkills,
  getSkillByCharacterId,
  getSkillById,
} from '@/lib/game/skills';

describe('Skills', () => {
  describe('CAT_SKILLS', () => {
    it('5種類のスキルが定義されている', () => {
      expect(CAT_SKILLS).toHaveLength(5);
    });

    it('各スキルに必要なプロパティがある', () => {
      CAT_SKILLS.forEach((skill) => {
        expect(skill).toHaveProperty('id');
        expect(skill).toHaveProperty('characterId');
        expect(skill).toHaveProperty('name');
        expect(skill).toHaveProperty('description');
        expect(skill).toHaveProperty('type');
        expect(skill).toHaveProperty('getTargets');
        expect(typeof skill.getTargets).toBe('function');
      });
    });

    it('ペルシャの範囲攻撃は3×3範囲を返す', () => {
      const persianSkill = CAT_SKILLS[0];
      const targets = persianSkill.getTargets({ x: 5, y: 5 });
      expect(targets.length).toBe(9); // 3×3 = 9マス
    });

    it('メインクーンの一列攻撃は10マスを返す', () => {
      const mainecoonSkill = CAT_SKILLS[1];
      const targets = mainecoonSkill.getTargets({ x: 5, y: 5 }, 'horizontal');
      expect(targets.length).toBe(10);
    });

    it('子猫の確実命中は1マスのみ返す', () => {
      const kittenSkill = CAT_SKILLS[4];
      const targets = kittenSkill.getTargets({ x: 5, y: 5 });
      expect(targets.length).toBe(1);
      expect(targets[0]).toEqual({ x: 5, y: 5 });
    });
  });

  describe('DOG_SKILLS', () => {
    it('5種類のスキルが定義されている', () => {
      expect(DOG_SKILLS).toHaveLength(5);
    });

    it('各スキルに必要なプロパティがある', () => {
      DOG_SKILLS.forEach((skill) => {
        expect(skill).toHaveProperty('id');
        expect(skill).toHaveProperty('characterId');
        expect(skill).toHaveProperty('name');
        expect(skill).toHaveProperty('description');
        expect(skill).toHaveProperty('type');
        expect(skill).toHaveProperty('getTargets');
      });
    });
  });

  describe('getTeamSkills', () => {
    it('猫チームのスキルを返す', () => {
      const skills = getTeamSkills('cat');
      expect(skills).toEqual(CAT_SKILLS);
    });

    it('犬チームのスキルを返す', () => {
      const skills = getTeamSkills('dog');
      expect(skills).toEqual(DOG_SKILLS);
    });
  });

  describe('getSkillByCharacterId', () => {
    it('キャラクターIDからスキルを取得できる', () => {
      const skill = getSkillByCharacterId('persian');
      expect(skill?.id).toBe('persian_skill');
      expect(skill?.name).toBe('範囲攻撃');
    });

    it('存在しないキャラクターIDの場合undefinedを返す', () => {
      const skill = getSkillByCharacterId('nonexistent');
      expect(skill).toBeUndefined();
    });
  });

  describe('getSkillById', () => {
    it('スキルIDからスキルを取得できる', () => {
      const skill = getSkillById('persian_skill');
      expect(skill?.characterId).toBe('persian');
    });

    it('存在しないスキルIDの場合undefinedを返す', () => {
      const skill = getSkillById('nonexistent_skill');
      expect(skill).toBeUndefined();
    });
  });

  describe('範囲判定', () => {
    it('盤面の端では範囲が制限される', () => {
      const persianSkill = CAT_SKILLS[0];
      // 左上隅
      const targets = persianSkill.getTargets({ x: 0, y: 0 });
      expect(targets.length).toBe(4); // 2×2のみ
      targets.forEach((pos) => {
        expect(pos.x).toBeGreaterThanOrEqual(0);
        expect(pos.x).toBeLessThan(10);
        expect(pos.y).toBeGreaterThanOrEqual(0);
        expect(pos.y).toBeLessThan(10);
      });
    });

    it('十字攻撃は最大5マス', () => {
      const skill = CAT_SKILLS[2]; // アメショー
      const targets = skill.getTargets({ x: 5, y: 5 });
      expect(targets.length).toBe(5); // 中心 + 上下左右
    });

    it('対角攻撃は最大5マス', () => {
      const skill = CAT_SKILLS[3]; // マンチカン
      const targets = skill.getTargets({ x: 5, y: 5 });
      expect(targets.length).toBe(5); // 中心 + 4対角
    });
  });
});
