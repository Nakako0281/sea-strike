import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import { useGame } from '@/contexts/GameContext';
import SkillSelectPage from '@/app/game/skill-select/page';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/GameContext', () => ({
  useGame: jest.fn(),
}));

describe('SkillSelectPage', () => {
  const mockPush = jest.fn();
  const mockSetSelectedSkills = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('redirects to home if no game state', () => {
    (useGame as jest.Mock).mockReturnValue({
      gameState: null,
      selectedSkills: [],
      setSelectedSkills: mockSetSelectedSkills,
    });

    render(<SkillSelectPage />);
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('displays all team skills for cat team', () => {
    (useGame as jest.Mock).mockReturnValue({
      gameState: { playerTeam: 'cat' },
      selectedSkills: [],
      setSelectedSkills: mockSetSelectedSkills,
    });

    render(<SkillSelectPage />);
    expect(screen.getAllByText('範囲攻撃').length).toBeGreaterThan(0);
    expect(screen.getAllByText('一列攻撃').length).toBeGreaterThan(0);
    expect(screen.getAllByText('十字攻撃').length).toBeGreaterThan(0);
    expect(screen.getAllByText('対角攻撃').length).toBeGreaterThan(0);
    expect(screen.getAllByText('確実命中').length).toBeGreaterThan(0);
  });

  it('allows selecting up to 3 skills', () => {
    (useGame as jest.Mock).mockReturnValue({
      gameState: { playerTeam: 'cat' },
      selectedSkills: [],
      setSelectedSkills: mockSetSelectedSkills,
    });

    render(<SkillSelectPage />);

    const skillButtons = screen.getAllByRole('button').filter((btn) =>
      btn.textContent?.includes('範囲攻撃') ||
      btn.textContent?.includes('一列攻撃') ||
      btn.textContent?.includes('十字攻撃')
    );

    // Select 3 skills
    fireEvent.click(skillButtons[0]);
    fireEvent.click(skillButtons[1]);
    fireEvent.click(skillButtons[2]);

    const confirmButton = screen.getByText('配置画面へ');
    expect(confirmButton).not.toBeDisabled();
  });

  it('disables confirm button when less than 3 skills selected', () => {
    (useGame as jest.Mock).mockReturnValue({
      gameState: { playerTeam: 'cat' },
      selectedSkills: [],
      setSelectedSkills: mockSetSelectedSkills,
    });

    render(<SkillSelectPage />);

    const confirmButton = screen.getByText(/あと3つ選択してください/);
    expect(confirmButton).toBeDisabled();
  });

  it('navigates to placement page on confirm', () => {
    (useGame as jest.Mock).mockReturnValue({
      gameState: { playerTeam: 'cat' },
      selectedSkills: [],
      setSelectedSkills: mockSetSelectedSkills,
    });

    render(<SkillSelectPage />);

    const skillButtons = screen.getAllByRole('button').filter((btn) =>
      btn.textContent?.includes('範囲攻撃') ||
      btn.textContent?.includes('一列攻撃') ||
      btn.textContent?.includes('十字攻撃')
    );

    fireEvent.click(skillButtons[0]);
    fireEvent.click(skillButtons[1]);
    fireEvent.click(skillButtons[2]);

    const confirmButton = screen.getByText('配置画面へ');
    fireEvent.click(confirmButton);

    expect(mockSetSelectedSkills).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/game/placement');
  });

  it('allows deselecting skills', () => {
    (useGame as jest.Mock).mockReturnValue({
      gameState: { playerTeam: 'dog' },
      selectedSkills: [],
      setSelectedSkills: mockSetSelectedSkills,
    });

    render(<SkillSelectPage />);

    const skillButtons = screen.getAllByRole('button').filter((btn) =>
      btn.textContent?.includes('範囲攻撃')
    );

    // Select
    fireEvent.click(skillButtons[0]);
    // Deselect
    fireEvent.click(skillButtons[0]);

    const confirmButton = screen.getByText(/あと3つ選択してください/);
    expect(confirmButton).toBeDisabled();
  });

  it('displays selection count correctly', () => {
    (useGame as jest.Mock).mockReturnValue({
      gameState: { playerTeam: 'cat' },
      selectedSkills: [],
      setSelectedSkills: mockSetSelectedSkills,
    });

    render(<SkillSelectPage />);
    expect(screen.getByText(/0\/3/)).toBeInTheDocument();

    const skillButtons = screen.getAllByRole('button').filter((btn) =>
      btn.textContent?.includes('範囲攻撃')
    );

    fireEvent.click(skillButtons[0]);
    expect(screen.getByText(/1\/3/)).toBeInTheDocument();
  });
});
