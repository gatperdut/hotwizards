import { AdjacentOffsets } from '../../directions/adjacents/adjacent-offsets.const.js';
import { Adjacent } from '../../directions/adjacents/adjacents.const.js';
import { heroSpritePath } from '../../sprites/hero-sprites.const.js';
import { cellAt } from '../cells/position/cell-at.const.js';
import { sameCell } from '../cells/position/same-cell.const.js';
import { HwDungeon } from '../dungeon.interface.js';

export const moveHero = (dungeon: HwDungeon, heroId: number, adjacent: Adjacent): void => {
  const hero = dungeon.heroes.find((m) => m.id === heroId)!;
  const currentCell = cellAt(dungeon.cells, hero.x, hero.y)!;
  const targetCell = cellAt(
    dungeon.cells,
    hero.x + AdjacentOffsets[adjacent].x,
    hero.y + AdjacentOffsets[adjacent].y,
  )!;

  dungeon.cells = dungeon.cells.map((cell) => {
    if (sameCell(currentCell, cell)) {
      return {
        ...currentCell,
        creatureId: null,
      };
    }

    if (sameCell(targetCell, cell)) {
      return {
        ...targetCell,
        creatureId: hero.id,
        searched: true,
      };
    }

    return cell;
  });

  dungeon.heroes = dungeon.heroes.map((h) => {
    if (hero.id !== h.id) {
      return h;
    }

    return {
      ...h,
      spritePath: heroSpritePath(h.klass, h.gender, adjacent),
      x: targetCell.x,
      y: targetCell.y,
      direction: adjacent,
      movementPoints: h.movementPoints - 1,
    };
  });
};
