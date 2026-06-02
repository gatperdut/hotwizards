import { HwCell } from '../cell.interface.js';

export const cellAt = (cells: HwCell[], x: number, y: number): HwCell | undefined => {
  return cells.find((c) => c.x === x && c.y === y);
};
