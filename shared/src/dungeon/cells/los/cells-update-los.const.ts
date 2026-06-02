import { HwCell } from '../cell.interface.js';
import { cellAt } from '../position/cell-at.const.js';
import { sameCell } from '../position/same-cell.const.js';
import { secondaryCells } from '../position/secondary-cells.const.js';
import { cellsHaveLos } from './cells-have-los.const.js';

export const cellsUpdateLos = (cells: HwCell[], origins: HwCell[]): void => {
  const fromFeature: HwCell[] = [];

  cells.forEach((cell) => {
    if (!fromFeature.find((c) => sameCell(c, cell)) && cell.visibility === 2) {
      cell.visibility = 1;
    }
  });

  cells.forEach((cell) => {
    origins.forEach((origin) => {
      if (cellsHaveLos(cells, origin, cell)) {
        cell.visibility = 2;

        if (fromFeature.find((c) => sameCell(c, cell))) {
          return;
        }

        let featureCell: HwCell | undefined;

        if (cell.secondary) {
          featureCell = cellAt(cells, cell.secondary.x, cell.secondary.y);
        } else if (cells.find((c) => c.secondary && sameCell(cell, c.secondary))) {
          featureCell = cell;
        }

        if (!featureCell) {
          return;
        }

        [featureCell, ...secondaryCells(cells, featureCell)].forEach((c) => {
          if (!sameCell(c, cell)) {
            c.visibility = 1;
          }
          fromFeature.push(c);
        });
      }
    });
  });
};
