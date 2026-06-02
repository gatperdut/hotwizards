import { HwCell } from '../cell.interface.js';
import { cellsHaveLos } from './cells-have-los.const.js';

export const losFrom = (cells: HwCell[], origins: HwCell[]): HwCell[] => {
  const result: HwCell[] = [];

  cells.forEach((cell) => {
    origins.forEach((origin) => {
      if (cellsHaveLos(cells, origin, cell)) {
        result.push(cell);
      }
    });
  });

  return result;
};
