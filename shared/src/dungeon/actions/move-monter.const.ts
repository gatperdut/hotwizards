import { AdjacentOffsets } from '../../directions/adjacents/adjacent-offsets.const.js';
import { Adjacent } from '../../directions/adjacents/adjacents.const.js';
import { monsterSpritePath } from '../../sprites/monster-sprites.const.js';
import { HwCell } from '../cells/cell.interface.js';
import { cellAt } from '../cells/position/cell-at.const.js';
import { sameCell } from '../cells/position/same-cell.const.js';
import { HwMonster } from '../creatures/monsters/monster.interface.js';
import { HwDungeon } from '../dungeon.interface.js';

export const moveMonster = (
  dungeon: HwDungeon,
  monsterId: number,
  adjacent: Adjacent,
): { cells: HwCell[]; monsters: HwMonster[] } => {
  const monster = dungeon.monsters.find((m) => m.id === monsterId)!;
  const currentCell = cellAt(dungeon.cells, monster.x, monster.y)!;
  const targetCell = cellAt(
    dungeon.cells,
    monster.x + AdjacentOffsets[adjacent].x,
    monster.y + AdjacentOffsets[adjacent].y,
  )!;

  const cells = dungeon.cells.map((c) => {
    if (sameCell(c, currentCell)) {
      return { ...c, creatureId: null };
    }

    if (sameCell(c, targetCell)) {
      return { ...c, creatureId: monsterId };
    }

    return c;
  });

  const monsters = dungeon.monsters.map((m) => {
    if (m.id !== monsterId) {
      return m;
    }

    return {
      ...m,
      spritePath: monsterSpritePath(m.type!, adjacent),
      direction: adjacent,
      x: targetCell.x,
      y: targetCell.y,
      movementPoints: m.movementPoints - 1,
    };
  });

  return { cells: cells, monsters: monsters };
};
