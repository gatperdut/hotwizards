import { AdjacentOffsets } from '../../../directions/adjacents/adjacent-offsets.const.js';
import { Adjacents } from '../../../directions/adjacents/adjacents.const.js';
import { HwCell } from '../cell.interface.js';
import { cellAt } from './cell-at.const.js';

export const adjacentCells = <T extends HwCell>(cells: T[], cell: T): T[] => {
  return Adjacents.map((adj) =>
    cellAt(cells, cell.x + AdjacentOffsets[adj].x, cell.y + AdjacentOffsets[adj].y),
  ).filter((c) => !!c);
};
