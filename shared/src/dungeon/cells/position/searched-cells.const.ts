import { HwCell } from '../cell.interface.js';
import { cellAt } from './cell-at.const.js';
import { directionCells } from './direction-cells.const.js';
import { sameCell } from './same-cell.const.js';

export const searchedCells = <T extends HwCell>(cells: T[], cell: T): T[] => {
  const result = directionCells(cells, cell);

  const added: T[] = [];

  result.forEach((c) => {
    cells
      .filter((somec) => !!somec.secondary && sameCell(c, somec.secondary))
      .forEach((somec) => {
        if (!cellAt(cells, somec.x, somec.y)) {
          added.push(somec);
        }
      });

    if (c.secondary) {
      const somec = cellAt(cells, c.secondary.x, c.secondary.y)!;
      if (!cellAt(cells, somec.x, somec.y)) {
        added.push(somec);
      }
    }
  });

  result.push(...added);

  return result;
};
