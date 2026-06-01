import { cellLos } from './cell-los.const.js';
import { HwCell } from './cell.interface.js';

export interface CellLosUpdate {
  revealed: HwCell[];
  unfogged: HwCell[];
  fogged: HwCell[];
}

export const cellLosUpdate = (cells: HwCell[], origins: HwCell[]): CellLosUpdate => {
  const result: CellLosUpdate = {
    revealed: [],
    unfogged: [],
    fogged: [],
  };

  cells.forEach((cell) => {
    origins.forEach((origin) => {
      if (cellLos(cells, origin, cell)) {
        if (cell.visibility === 0) {
          result.revealed.push(cell);
        } else if (cell.visibility === 1) {
          result.unfogged.push(cell);
        }

        cell.visibility = 2;
      } else {
        if (cell.visibility === 2) {
          cell.visibility = 1;
          result.fogged.push(cell);
        }
      }
    });
  });

  return result;
};
