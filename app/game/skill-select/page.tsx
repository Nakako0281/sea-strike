'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/contexts/GameContext';
import { getTeamSkills } from '@/lib/game/skills';

export default function SkillSelectPage() {
  const router = useRouter();
  const { gameState, selectedSkills, setSelectedSkills } = useGame();
  const [localSelected, setLocalSelected] = useState<string[]>(selectedSkills);

  if (!gameState) {
    router.push('/');
    return null;
  }

  const teamSkills = getTeamSkills(gameState.playerTeam);
  const MAX_SKILLS = 3;

  const toggleSkill = (skillId: string) => {
    if (localSelected.includes(skillId)) {
      setLocalSelected(localSelected.filter((id) => id !== skillId));
    } else {
      if (localSelected.length < MAX_SKILLS) {
        setLocalSelected([...localSelected, skillId]);
      }
    }
  };

  const handleConfirm = () => {
    setSelectedSkills(localSelected);
    router.push('/game/setup');
  };

  const canConfirm = localSelected.length === MAX_SKILLS;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
            スキル選択
          </h1>
          <p className="text-center text-gray-600 mb-8">
            戦闘で使用するスキルを3つ選んでください ({localSelected.length}/{MAX_SKILLS})
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {teamSkills.map((skill) => {
              const isSelected = localSelected.includes(skill.id);
              const selectionIndex = localSelected.indexOf(skill.id);

              return (
                <button
                  key={skill.id}
                  onClick={() => toggleSkill(skill.id)}
                  disabled={!isSelected && localSelected.length >= MAX_SKILLS}
                  className={`
                    relative p-6 rounded-xl border-2 transition-all duration-200
                    ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50 shadow-lg transform scale-105'
                        : localSelected.length >= MAX_SKILLS
                        ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                        : 'border-gray-300 bg-white hover:border-purple-300 hover:shadow-md'
                    }
                  `}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                      {selectionIndex + 1}
                    </div>
                  )}

                  <h3 className="text-xl font-bold mb-2 text-gray-800">
                    {skill.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3">
                    {skill.description}
                  </p>

                  <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    {skill.type === 'line' && '一列攻撃'}
                    {skill.type === 'area' && '範囲攻撃'}
                    {skill.type === 'single' && '単体攻撃'}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => router.push('/game/team-select')}
              className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors"
            >
              戻る
            </button>

            <button
              onClick={handleConfirm}
              disabled={!canConfirm}
              className={`
                flex-1 px-6 py-3 rounded-xl font-semibold transition-colors
                ${
                  canConfirm
                    ? 'bg-purple-500 text-white hover:bg-purple-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {canConfirm ? '配置画面へ' : `あと${MAX_SKILLS - localSelected.length}つ選択してください`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
