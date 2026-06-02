import { HwCell } from '../cell.interface.js';

export const cellIsAt = <T extends HwCell>(cell: T, x: number, y: number): boolean => {
  return cell.x === x && cell.y === y;
};
