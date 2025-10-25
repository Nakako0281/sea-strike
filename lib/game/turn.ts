import type { Team } from '@/types';

/**
 * ターンを切り替える
 * @param currentTurn 現在のターン
 * @returns 次のターン
 */
export function switchTurn(currentTurn: Team): Team {
  return currentTurn === 'cat' ? 'dog' : 'cat';
}

/**
 * ヒット時に連続攻撃できるかチェック
 * @param wasHit 前回の攻撃がヒットしたか
 * @returns 同じプレイヤーが続けて攻撃できるか
 */
export function canContinue(wasHit: boolean): boolean {
  return wasHit;
}

/**
 * 次の攻撃者を決定
 * @param currentTurn 現在のターン
 * @param wasHit 前回の攻撃がヒットしたか
 * @returns 次の攻撃者
 */
export function getNextAttacker(currentTurn: Team, wasHit: boolean): Team {
  if (canContinue(wasHit)) {
    return currentTurn;
  }
  return switchTurn(currentTurn);
}
