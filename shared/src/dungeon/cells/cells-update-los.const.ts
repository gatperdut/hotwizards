import { cellLos } from './cell-los.const.js';
import { HwCell } from './cell.interface.js';

export const cellsUpdateLos = (cells: HwCell[], origins: HwCell[]): void => {
  cells.forEach((cell) => {
    if (cell.visibility === 2) {
      cell.visibility = 1;
    }
  });

  cells.forEach((cell) => {
    origins.forEach((origin) => {
      if (cellLos(cells, origin, cell)) {
        cell.visibility = 2;
      }
    });
  });
};
