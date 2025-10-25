// スキル関連の型定義

import { Position } from './Game';

export type SkillType = 'area' | 'line' | 'single';

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
  isAvailable: boolean; // キャラが生きているか
};

export type SkillAction = {
  type: 'skill';
  skillId: string;
  target: Position;
  direction?: 'horizontal' | 'vertical';
};

export type AttackAction = {
  type: 'attack';
  target: Position;
};

export type Action = SkillAction | AttackAction;
