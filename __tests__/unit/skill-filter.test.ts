import {  filterSelectedSkills, type CharacterSkillState } from '@/lib/game/skillExecutor';

describe('filterSelectedSkills', () => {
  const mockSkillStates: CharacterSkillState[] = [
    { characterId: 'persian', skillId: 'persian_skill', isUsed: false, isAvailable: true },
    { characterId: 'mainecoon', skillId: 'mainecoon_skill', isUsed: false, isAvailable: true },
    { characterId: 'americanshorthair', skillId: 'americanshorthair_skill', isUsed: true, isAvailable: true },
    { characterId: 'munchkin', skillId: 'munchkin_skill', isUsed: false, isAvailable: false },
    { characterId: 'kitten', skillId: 'kitten_skill', isUsed: false, isAvailable: true },
  ];

  it('filters skills to only selected IDs', () => {
    const selected = ['persian_skill', 'mainecoon_skill', 'kitten_skill'];
    const result = filterSelectedSkills(mockSkillStates, selected);

    expect(result).toHaveLength(3);
    expect(result.map((s) => s.skillId)).toEqual(selected);
  });

  it('returns empty array when no skills selected', () => {
    const result = filterSelectedSkills(mockSkillStates, []);
    expect(result).toHaveLength(0);
  });

  it('preserves skill state properties', () => {
    const selected = ['americanshorthair_skill'];
    const result = filterSelectedSkills(mockSkillStates, selected);

    expect(result[0]).toEqual({
      characterId: 'americanshorthair',
      skillId: 'americanshorthair_skill',
      isUsed: true,
      isAvailable: true,
    });
  });

  it('returns empty array for non-existent skill IDs', () => {
    const selected = ['nonexistent_skill'];
    const result = filterSelectedSkills(mockSkillStates, selected);
    expect(result).toHaveLength(0);
  });

  it('handles partial matching correctly', () => {
    const selected = ['persian_skill', 'nonexistent_skill', 'kitten_skill'];
    const result = filterSelectedSkills(mockSkillStates, selected);

    expect(result).toHaveLength(2);
    expect(result.map((s) => s.skillId)).toEqual(['persian_skill', 'kitten_skill']);
  });
});
