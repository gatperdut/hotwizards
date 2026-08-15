import { AdjacentOffsets } from '../../directions/adjacents/adjacent-offsets.const.js';
import { Adjacent } from '../../directions/adjacents/adjacents.const.js';
import {
  ClosedDoorSpritePath,
  ClosedToOpenDoorSpritePaths,
} from '../../sprites/door-sprites.const.js';
import { HwCell } from '../cells/cell.interface.js';
import { cellAt } from '../cells/position/cell-at.const.js';
import { sameCell } from '../cells/position/same-cell.const.js';

export const openDoor = <T extends HwCell>(
  allCells: T[],
  x: number,
  y: number,
  adjacent: Adjacent,
): T[] | null => {
  const targetCell = cellAt(
    allCells,
    x + AdjacentOffsets[adjacent].x,
    y + AdjacentOffsets[adjacent].y,
  );

  if (!targetCell || !targetCell.door.spritePath || targetCell.door.open) {
    return null;
  }

  return allCells.map((cell) => {
    if (sameCell(targetCell, cell)) {
      return {
        ...targetCell,
        door: {
          ...targetCell.door,
          spritePath:
            ClosedToOpenDoorSpritePaths[targetCell.door.spritePath as ClosedDoorSpritePath],
          open: true,
        },
      };
    }

    return cell;
  });
};
