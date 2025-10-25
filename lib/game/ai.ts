import { getUnattackedCells } from './combat';
import { canUseSkill } from './skillExecutor';
import { getTeamSkills } from './skills';
import type { Board, Position, CharacterSkillState, Team } from '@/types';

export type AIAction = {
  type: 'attack' | 'skill';
  target: Position;
  skillId?: string;
  direction?: 'horizontal' | 'vertical';
};

/**
 * CPU思考ロジック（簡単レベル）
 * - ランダムに未攻撃マスを選択
 * - 20%の確率でスキルを使用
 */
export function cpuThinkEasy(
  opponentBoard: Board,
  skillStates: CharacterSkillState[],
  team: Team
): AIAction {
  // 未攻撃のマスを取得
  const unattackedCells = getUnattackedCells(opponentBoard);

  if (unattackedCells.length === 0) {
    // すべて攻撃済みの場合は適当な位置を返す
    return {
      type: 'attack',
      target: { x: 0, y: 0 },
    };
  }

  // ランダムなマスを選択
  const randomIndex = Math.floor(Math.random() * unattackedCells.length);
  const targetCell = unattackedCells[randomIndex];

  // 使用可能なスキルを取得
  const availableSkills = skillStates.filter((state) =>
    canUseSkill(skillStates, state.skillId)
  );

  // 20%の確率でスキルを使用
  if (Math.random() < 0.2 && availableSkills.length > 0) {
    const randomSkillIndex = Math.floor(Math.random() * availableSkills.length);
    const selectedSkill = availableSkills[randomSkillIndex];

    // スキルの種類によって方向を決定
    const teamSkills = getTeamSkills(team);
    const skillData = teamSkills.find((s) => s.id === selectedSkill.skillId);

    let direction: 'horizontal' | 'vertical' | undefined;
    if (skillData?.type === 'line') {
      // 一列攻撃の場合はランダムに方向を選択
      direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
    }

    return {
      type: 'skill',
      target: targetCell,
      skillId: selectedSkill.skillId,
      direction,
    };
  }

  // 通常攻撃
  return {
    type: 'attack',
    target: targetCell,
  };
}

/**
 * CPU思考時間を取得（ミリ秒）
 */
export function getCPUThinkingTime(): number {
  // 1-2秒のランダムな思考時間
  return 1000 + Math.random() * 1000;
}
