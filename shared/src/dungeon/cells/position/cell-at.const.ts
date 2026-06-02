import { HwCell } from '../cell.interface.js';

export const cellAt = <T extends HwCell>(cells: T[], x: number, y: number): T | undefined => {
  return cells.find((c) => c.x === x && c.y === y);
};
