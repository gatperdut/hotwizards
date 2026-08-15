import { HwCell } from './cell.interface.js';
import { cellAt } from './position/cell-at.const.js';
import { secondaryCells } from './position/secondary-cells.const.js';

export const searchSecondaryCells = <T extends HwCell>(
  searchCells: T[],
  updatedCells: T[],
  allCells: T[],
): void => {
  searchCells.forEach((cell) => {
    secondaryCells(allCells, cell).forEach((secCell) => {
      const updatedC = cellAt(updatedCells, secCell.x, secCell.y);
      if (updatedC) {
        updatedC.searched = true;
        updatedC.feature.trap.found = true;
      }
    });

    if (cell.secondary) {
      const secondary = cellAt(updatedCells, cell.secondary.x, cell.secondary.y)!;
      secondary.searched = true;
      secondary.feature.trap.found = true;
    }
  });
};
