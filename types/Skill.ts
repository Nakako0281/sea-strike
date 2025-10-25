// スキル関連の型定義

import type { Position } from './Game';

export type SkillType = 'line' | 'area' | 'single';

export type Skill = {
  id: string;
  characterId: string;
  name: string;
  description: string;
  type: SkillType;
  getTargets: (origin: Position, direction?: 'horizontal' | 'vertical') => Position[];
};

export type CharacterSkillState = {
  characterId: string;
  skillId: string;
  isUsed: boolean;
  isAvailable: boolean;
};
