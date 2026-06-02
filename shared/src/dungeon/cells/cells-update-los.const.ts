import { cellAt } from './cell-at.const.js';
import { cellLos } from './cell-los.const.js';
import { HwCell } from './cell.interface.js';
import { sameCell } from './same-cell.const.js';

export const cellsUpdateLos = (cells: HwCell[], origins: HwCell[]): void => {
  const skip: HwCell[] = [];

  cells.forEach((cell) => {
    if (skip.find((c) => sameCell(c, cell))) {
      return;
    }

    if (cell.visibility === 2) {
      cell.visibility = 1;
    }
  });

  cells.forEach((cell) => {
    origins.forEach((origin) => {
      if (cellLos(cells, origin, cell)) {
        cell.visibility = 2;

        let featureCell: HwCell | undefined;

        if (cell.secondary) {
          featureCell = cellAt(cells, cell.secondary.x, cell.secondary.y);
        } else if (cells.find((c) => c.secondary && sameCell(cell, c.secondary))) {
          featureCell = cell;
        }

        if (!featureCell) {
          return;
        }

        [
          featureCell,
          ...cells.filter((c) => c.secondary && sameCell(featureCell, c.secondary)),
        ].forEach((c) => {
          c.visibility = 2;
          skip.push(c);
        });
      }
    });
  });
};
