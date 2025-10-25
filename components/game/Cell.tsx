import type { Cell as CellType } from '@/types';

type CellProps = {
  cell: CellType;
  onClick?: () => void;
  showShips?: boolean;
  disabled?: boolean;
};

export function Cell({ cell, onClick, showShips = true, disabled = false }: CellProps) {
  const { hasShip, isHit, isMiss } = cell;

  const getCellStyle = () => {
    if (isHit) return 'bg-red-500 text-white';
    if (isMiss) return 'bg-blue-300';
    if (hasShip && showShips) return 'bg-amber-200 border-amber-400';
    return 'bg-gray-100 hover:bg-gray-200';
  };

  const getCellContent = () => {
    if (isHit) return '💥';
    if (isMiss) return '❌';
    if (hasShip && showShips) return '📦';
    return '';
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isHit || isMiss}
      className={`
        w-10 h-10 border-2 border-gray-300
        flex items-center justify-center text-xl
        transition-colors
        disabled:cursor-not-allowed
        ${getCellStyle()}
      `}
      aria-label={`Cell at ${cell.position.x}, ${cell.position.y}`}
    >
      {getCellContent()}
    </button>
  );
}
