import { cellAt } from '../cells/position/cell-at.const.js';
import { searchedCells } from '../cells/position/searched-cells.const.js';
import { HwDungeon } from '../dungeon.interface.js';
import { searchSecondaryCells } from './search-secondary-cells.const.js';

export const search = (dungeon: HwDungeon, heroId: number): void => {
  const hero = dungeon.heroes.find((h) => h.id === heroId)!;

  const searchCells = searchedCells(dungeon.cells, cellAt(dungeon.cells, hero.x, hero.y)!);

  const updatedCells = dungeon.cells.map((c) =>
    cellAt(searchCells, c.x, c.y)
      ? {
          ...c,
          searched: true,
          floorTrap: { ...c.floorTrap, found: true },
          feature: { ...c.feature, trap: { ...c.feature.trap, found: true } },
          door: { ...c.door, trap: { ...c.door.trap, found: true } },
        }
      : c,
  );

  searchSecondaryCells(searchCells, updatedCells, dungeon.cells);

  dungeon.heroes = dungeon.heroes.map((h) => {
    if (h.id !== heroId) {
      return h;
    }

    return {
      ...h,
      actionPoints: h.actionPoints - 1,
    };
  });

  dungeon.cells = updatedCells;
};
