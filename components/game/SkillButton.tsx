import type { Skill, CharacterSkillState } from '@/types';

type SkillButtonProps = {
  skill: Skill;
  skillState: CharacterSkillState;
  onClick: () => void;
};

export function SkillButton({ skill, skillState, onClick }: SkillButtonProps) {
  const { isUsed, isAvailable } = skillState;
  const canUse = isAvailable && !isUsed;

  return (
    <button
      onClick={canUse ? onClick : undefined}
      disabled={!canUse}
      className={`
        w-full p-3 rounded-lg border-2 text-left transition-all
        ${
          canUse
            ? 'bg-purple-50 border-purple-400 hover:bg-purple-100 hover:shadow-md cursor-pointer'
            : ''
        }
        ${isUsed ? 'bg-gray-100 border-gray-300 text-gray-500' : ''}
        ${!isAvailable ? 'bg-gray-200 border-gray-400 text-gray-400' : ''}
      `}
      title={skill.description}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="font-semibold text-sm">
            {skill.name}
            {canUse && <span className="ml-2 text-yellow-500">⚡</span>}
            {isUsed && <span className="ml-2 text-green-600">✓</span>}
            {!isAvailable && <span className="ml-2 text-red-600">❌</span>}
          </div>
          <div className="text-xs text-gray-600 mt-1">{skill.description}</div>
        </div>
      </div>
    </button>
  );
}
