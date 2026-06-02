import { HwCell } from '../cell.interface.js';
import { sameCell } from './same-cell.const.js';

export const secondaryCells = (cells: HwCell[], cell: HwCell): HwCell[] => {
  return cells.filter((c) => c.secondary && sameCell(c.secondary, cell));
};
