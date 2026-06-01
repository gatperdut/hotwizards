import { HwCell } from './cell.interface.js';

export const sameCell = (
  cell1: Pick<HwCell, 'x' | 'y'>,
  cell2: Pick<HwCell, 'x' | 'y'>,
): boolean => {
  return cell1.x === cell2.x && cell1.y === cell2.y;
};
