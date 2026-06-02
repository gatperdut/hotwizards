import { HwCell } from '../cell.interface.js';

export const cellIsAt = (cell: HwCell, x: number, y: number): boolean => {
  return cell.x === x && cell.y === y;
};
