import { attack } from './combat';
import type { Board, Ship, Position, AttackResult } from '@/types';
import type { Skill } from './skills';

export type CharacterSkillState = {
  characterId: string;
  skillId: string;
  isUsed: boolean;
  isAvailable: boolean; // キャラが生きているか
};

/**
 * スキルを実行して複数の攻撃結果を返す
 */
export function executeSkill(
  skill: Skill,
  origin: Position,
  board: Board,
  ships: Ship[],
  direction?: 'horizontal' | 'vertical'
): {
  results: AttackResult[];
  updatedBoard: Board;
  updatedShips: Ship[];
} {
  const targets = skill.getTargets(origin, direction);
  const results: AttackResult[] = [];
  let currentBoard = board;
  let currentShips = ships;

  // 確実命中スキルの場合、艦船がなくてもヒット扱い
  if (skill.type === 'single' && skill.name === '確実命中') {
    const cell = currentBoard[origin.y][origin.x];
    if (!cell.isHit && !cell.isMiss) {
      // 艦船がある場合は通常の攻撃
      if (cell.hasShip) {
        const attackResult = attack(currentBoard, origin, currentShips);
        if (attackResult) {
          results.push(attackResult.result);
          currentBoard = attackResult.updatedBoard;
          currentShips = attackResult.updatedShips;
        }
      } else {
        // 艦船がない場合でも"ヒット"扱いにする（フェイク）
        const newBoard = currentBoard.map((row) =>
          row.map((c) =>
            c.position.x === origin.x && c.position.y === origin.y
              ? { ...c, isHit: true }
              : c
          )
        );
        currentBoard = newBoard;
        results.push({
          type: 'hit',
          position: origin,
          shipName: '（確実命中）',
        });
      }
    }
  } else {
    // 通常スキル: 各ターゲットに攻撃
    for (const target of targets) {
      const cell = currentBoard[target.y][target.x];
      // すでに攻撃済みのマスはスキップ
      if (cell.isHit || cell.isMiss) {
        continue;
      }

      const attackResult = attack(currentBoard, target, currentShips);
      if (attackResult) {
        results.push(attackResult.result);
        currentBoard = attackResult.updatedBoard;
        currentShips = attackResult.updatedShips;
      }
    }
  }

  return {
    results,
    updatedBoard: currentBoard,
    updatedShips: currentShips,
  };
}

/**
 * スキル状態を初期化
 */
export function initializeSkillStates(ships: Ship[]): CharacterSkillState[] {
  return ships.map((ship) => ({
    characterId: ship.characterId,
    skillId: `${ship.characterId}_skill`,
    isUsed: false,
    isAvailable: true,
  }));
}

/**
 * スキルを使用済みにする
 */
export function markSkillAsUsed(
  skillStates: CharacterSkillState[],
  skillId: string
): CharacterSkillState[] {
  return skillStates.map((state) =>
    state.skillId === skillId ? { ...state, isUsed: true } : state
  );
}

/**
 * 撃沈されたキャラのスキルを無効化
 */
export function updateSkillAvailability(
  skillStates: CharacterSkillState[],
  ships: Ship[]
): CharacterSkillState[] {
  return skillStates.map((state) => {
    const ship = ships.find((s) => s.characterId === state.characterId);
    return {
      ...state,
      isAvailable: ship ? !ship.isSunk : false,
    };
  });
}

/**
 * スキルが使用可能かチェック
 */
export function canUseSkill(
  skillStates: CharacterSkillState[],
  skillId: string
): boolean {
  const state = skillStates.find((s) => s.skillId === skillId);
  if (!state) return false;
  return state.isAvailable && !state.isUsed;
}
