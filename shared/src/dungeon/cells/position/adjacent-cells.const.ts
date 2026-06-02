import { DirectionOffsets } from '../../../directions/direction-offsets.const.js';
import { Directions } from '../../../directions/directions.const.js';
import { HwCell } from '../cell.interface.js';
import { cellAt } from './cell-at.const.js';

export const adjacentCells = (cells: HwCell[], cell: HwCell): HwCell[] => {
  return Directions.map((dir) =>
    cellAt(cells, cell.x + DirectionOffsets[dir].x, cell.y + DirectionOffsets[dir].y),
  ).filter((c) => !!c);
};
