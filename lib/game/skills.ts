import type { Position, Team } from '@/types';

export type SkillType = 'line' | 'area' | 'single';

export type Skill = {
  id: string;
  characterId: string;
  name: string;
  description: string;
  type: SkillType;
  getTargets: (origin: Position, direction?: 'horizontal' | 'vertical') => Position[];
};

/**
 * 3×3範囲の座標を取得
 */
function getAreaTargets(origin: Position): Position[] {
  const targets: Position[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const x = origin.x + dx;
      const y = origin.y + dy;
      if (x >= 0 && x < 10 && y >= 0 && y < 10) {
        targets.push({ x, y });
      }
    }
  }
  return targets;
}

/**
 * 一列（横または縦）の座標を取得
 */
function getLineTargets(origin: Position, direction: 'horizontal' | 'vertical' = 'horizontal'): Position[] {
  const targets: Position[] = [];
  if (direction === 'horizontal') {
    for (let x = 0; x < 10; x++) {
      targets.push({ x, y: origin.y });
    }
  } else {
    for (let y = 0; y < 10; y++) {
      targets.push({ x: origin.x, y });
    }
  }
  return targets;
}

/**
 * 単一座標を取得（確実命中用）
 */
function getSingleTarget(origin: Position): Position[] {
  return [origin];
}

/**
 * 十字範囲（5マス）の座標を取得
 */
function getCrossTargets(origin: Position): Position[] {
  const targets: Position[] = [origin];
  const directions = [
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
  ];

  for (const { dx, dy } of directions) {
    const x = origin.x + dx;
    const y = origin.y + dy;
    if (x >= 0 && x < 10 && y >= 0 && y < 10) {
      targets.push({ x, y });
    }
  }
  return targets;
}

/**
 * 対角範囲（5マス）の座標を取得
 */
function getDiagonalTargets(origin: Position): Position[] {
  const targets: Position[] = [origin];
  const directions = [
    { dx: -1, dy: -1 },
    { dx: 1, dy: -1 },
    { dx: -1, dy: 1 },
    { dx: 1, dy: 1 },
  ];

  for (const { dx, dy } of directions) {
    const x = origin.x + dx;
    const y = origin.y + dy;
    if (x >= 0 && x < 10 && y >= 0 && y < 10) {
      targets.push({ x, y });
    }
  }
  return targets;
}

// 猫チームのスキル
export const CAT_SKILLS: Skill[] = [
  {
    id: 'persian_skill',
    characterId: 'persian',
    name: '範囲攻撃',
    description: '3×3範囲を攻撃',
    type: 'area',
    getTargets: getAreaTargets,
  },
  {
    id: 'mainecoon_skill',
    characterId: 'mainecoon',
    name: '一列攻撃',
    description: '縦または横一列を攻撃',
    type: 'line',
    getTargets: getLineTargets,
  },
  {
    id: 'americanshorthair_skill',
    characterId: 'americanshorthair',
    name: '十字攻撃',
    description: '十字（5マス）を攻撃',
    type: 'area',
    getTargets: getCrossTargets,
  },
  {
    id: 'munchkin_skill',
    characterId: 'munchkin',
    name: '対角攻撃',
    description: '対角（5マス）を攻撃',
    type: 'area',
    getTargets: getDiagonalTargets,
  },
  {
    id: 'kitten_skill',
    characterId: 'kitten',
    name: '確実命中',
    description: '選んだマスに必ず命中（艦船がいなくてもヒット扱い）',
    type: 'single',
    getTargets: getSingleTarget,
  },
];

// 犬チームのスキル
export const DOG_SKILLS: Skill[] = [
  {
    id: 'goldenretriever_skill',
    characterId: 'goldenretriever',
    name: '範囲攻撃',
    description: '3×3範囲を攻撃',
    type: 'area',
    getTargets: getAreaTargets,
  },
  {
    id: 'husky_skill',
    characterId: 'husky',
    name: '一列攻撃',
    description: '縦または横一列を攻撃',
    type: 'line',
    getTargets: getLineTargets,
  },
  {
    id: 'beagle_skill',
    characterId: 'beagle',
    name: '十字攻撃',
    description: '十字（5マス）を攻撃',
    type: 'area',
    getTargets: getCrossTargets,
  },
  {
    id: 'chihuahua_skill',
    characterId: 'chihuahua',
    name: '対角攻撃',
    description: '対角（5マス）を攻撃',
    type: 'area',
    getTargets: getDiagonalTargets,
  },
  {
    id: 'puppy_skill',
    characterId: 'puppy',
    name: '確実命中',
    description: '選んだマスに必ず命中（艦船がいなくてもヒット扱い）',
    type: 'single',
    getTargets: getSingleTarget,
  },
];

/**
 * チームのスキルを取得
 */
export function getTeamSkills(team: Team): Skill[] {
  return team === 'cat' ? CAT_SKILLS : DOG_SKILLS;
}

/**
 * キャラクターIDからスキルを取得
 */
export function getSkillByCharacterId(characterId: string): Skill | undefined {
  return [...CAT_SKILLS, ...DOG_SKILLS].find((skill) => skill.characterId === characterId);
}

/**
 * スキルIDからスキルを取得
 */
export function getSkillById(skillId: string): Skill | undefined {
  return [...CAT_SKILLS, ...DOG_SKILLS].find((skill) => skill.id === skillId);
}
