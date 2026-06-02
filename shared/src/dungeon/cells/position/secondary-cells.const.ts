import { HwCell } from '../cell.interface.js';
import { sameCell } from './same-cell.const.js';

export const secondaryCells = <T extends HwCell>(cells: T[], cell: T): T[] => {
  return cells.filter((c) => c.secondary && sameCell(c.secondary, cell));
};
