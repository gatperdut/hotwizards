import { HwCell } from '../cell.interface.js';
import { cellsHaveLos } from './cells-have-los.const.js';

export const losFrom = <T extends HwCell>(cells: T[], origins: T[]): T[] => {
  const result: T[] = [];

  cells.forEach((cell) => {
    origins.forEach((origin) => {
      if (cellsHaveLos(cells, origin, cell)) {
        result.push(cell);
      }
    });
  });

  return result;
};
