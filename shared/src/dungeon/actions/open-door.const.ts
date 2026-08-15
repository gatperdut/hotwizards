import { AdjacentOffsets } from '../../directions/adjacents/adjacent-offsets.const.js';
import { Adjacent } from '../../directions/adjacents/adjacents.const.js';
import {
  ClosedDoorSpritePath,
  ClosedToOpenDoorSpritePaths,
} from '../../sprites/door-sprites.const.js';
import { heroSpritePath } from '../../sprites/hero-sprites.const.js';
import { cellAt } from '../cells/position/cell-at.const.js';
import { sameCell } from '../cells/position/same-cell.const.js';
import { HwDungeon } from '../dungeon.interface.js';

export const openDoor = (dungeon: HwDungeon, x: number, y: number, adjacent: Adjacent): boolean => {
  const targetCell = cellAt(
    dungeon.cells,
    x + AdjacentOffsets[adjacent].x,
    y + AdjacentOffsets[adjacent].y,
  );

  if (!targetCell || !targetCell.door.spritePath || targetCell.door.open) {
    return false;
  }

  dungeon.cells = dungeon.cells.map((cell) => {
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

  const hero = dungeon.heroes.find((h) => h.x === x && h.y === y)!;

  dungeon.heroes = dungeon.heroes.map((h) =>
    h.id === hero.id
      ? {
          ...h,
          spritePath: heroSpritePath(h.klass, h.gender, adjacent),
          direction: adjacent,
          movementPoints: h.movementPoints - 1,
        }
      : h,
  );

  return true;
};
