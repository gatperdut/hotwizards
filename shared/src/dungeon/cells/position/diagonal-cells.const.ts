import { DiagonalOffsets } from '../../../directions/diagonals/diagonal-offsets.const.js';
import { Diagonals } from '../../../directions/diagonals/diagonals.const.js';
import { HwCell } from '../cell.interface.js';
import { cellAt } from './cell-at.const.js';

export const diagonalCells = <T extends HwCell>(cells: T[], cell: T): T[] => {
  return Diagonals.map((dia) =>
    cellAt(cells, cell.x + DiagonalOffsets[dia].x, cell.y + DiagonalOffsets[dia].y),
  ).filter((c) => !!c);
};
