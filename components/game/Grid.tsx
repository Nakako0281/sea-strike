import type { Board, Position } from '@/types';
import { Cell } from './Cell';

type GridProps = {
  board: Board;
  onCellClick?: (position: Position) => void;
  showShips?: boolean;
  disabled?: boolean;
  title?: string;
};

export function Grid({ board, onCellClick, showShips = true, disabled = false, title }: GridProps) {
  return (
    <div className="inline-block">
      {title && <h3 className="text-lg font-semibold mb-2 text-center">{title}</h3>}
      <div className="inline-grid grid-cols-10 gap-0 border-4 border-gray-400 bg-gray-400 p-1">
        {board.map((row, y) =>
          row.map((cell, x) => (
            <Cell
              key={`${x}-${y}`}
              cell={cell}
              onClick={() => onCellClick?.(cell.position)}
              showShips={showShips}
              disabled={disabled}
            />
          ))
        )}
      </div>
    </div>
  );
}
