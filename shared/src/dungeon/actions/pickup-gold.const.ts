import { cellAt } from '../cells/position/cell-at.const.js';
import { sameCell } from '../cells/position/same-cell.const.js';
import { HwDungeon } from '../dungeon.interface.js';

export const pickupGold = (dungeon: HwDungeon, heroId: number, amount: number): void => {
  const hero = dungeon.heroes.find((h) => h.id === heroId)!;
  const cell = cellAt(dungeon.cells, hero.x, hero.y)!;

  cell.loot.gold -= amount;
  hero.inventory.backpack.gold += amount;

  dungeon.heroes = dungeon.heroes.map((h) => {
    if (h.id !== heroId) {
      return h;
    }

    return {
      ...h,
      movementPoints: h.movementPoints - 1,
      inventory: { gear: { ...hero.inventory.gear }, backpack: { ...hero.inventory.backpack } },
    };
  });

  dungeon.cells = dungeon.cells.map((c) => {
    if (!sameCell(c, cell)) {
      return c;
    }

    return {
      ...c,
      loot: { ...cell.loot, items: [...cell.loot.items] },
    };
  });
};
