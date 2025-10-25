import type { Character, Team } from '@/types';

// 猫チーム
export const CAT_TEAM: Character[] = [
  {
    id: 'persian',
    name: 'ペルシャ猫',
    size: 5,
    team: 'cat',
  },
  {
    id: 'mainecoon',
    name: 'メインクーン',
    size: 4,
    team: 'cat',
  },
  {
    id: 'americanshort',
    name: 'アメショー',
    size: 3,
    team: 'cat',
  },
  {
    id: 'munchkin',
    name: 'マンチカン',
    size: 3,
    team: 'cat',
  },
  {
    id: 'kitten',
    name: '子猫',
    size: 2,
    team: 'cat',
  },
];

// 犬チーム
export const DOG_TEAM: Character[] = [
  {
    id: 'golden',
    name: 'ゴールデン',
    size: 5,
    team: 'dog',
  },
  {
    id: 'shiba',
    name: '柴犬',
    size: 4,
    team: 'dog',
  },
  {
    id: 'corgi',
    name: 'コーギー',
    size: 3,
    team: 'dog',
  },
  {
    id: 'beagle',
    name: 'ビーグル',
    size: 3,
    team: 'dog',
  },
  {
    id: 'chihuahua',
    name: 'チワワ',
    size: 2,
    team: 'dog',
  },
];

/**
 * チームのキャラクターを取得
 */
export function getTeamCharacters(team: Team): Character[] {
  return team === 'cat' ? CAT_TEAM : DOG_TEAM;
}

/**
 * チームの総マス数を計算
 */
export function getTotalShipCells(team: Team): number {
  return getTeamCharacters(team).reduce((total, char) => total + char.size, 0);
}
