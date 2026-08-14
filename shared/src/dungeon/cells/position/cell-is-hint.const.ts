import { HwCell } from '../cell.interface.js';
import { adjacentCells } from './adjacent-cells.const.js';

export const cellIsHint = <T extends HwCell>(cells: T[], cell: T): boolean => {
  return (
    cell.visibility === 0 &&
    adjacentCells(cells, cell).some((c) => c.visibility > 0 && (!c.door.spritePath || c.door.open))
  );
};
