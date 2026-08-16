import { cellAt } from '../cells/position/cell-at.const.js';
import { sameCell } from '../cells/position/same-cell.const.js';
import { HwDungeon } from '../dungeon.interface.js';

export const pickupItem = (dungeon: HwDungeon, heroId: number, lootItemId: string): void => {
  const hero = dungeon.heroes.find((h) => h.id === heroId)!;
  const cell = cellAt(dungeon.cells, hero.x, hero.y)!;
  const loot = { ...cell.loot };

  const lootItem = loot.items.find((i) => i.id === lootItemId)!;
  loot.items = loot.items.filter((i) => i.id !== lootItemId);
  hero.inventory.backpack.items.push(lootItem);

  dungeon.heroes = dungeon.heroes.map((h) =>
    h.id === heroId
      ? {
          ...h,
          inventory: { gear: { ...hero.inventory.gear }, backpack: { ...hero.inventory.backpack } },
          movementPoints: h.movementPoints - 1,
        }
      : h,
  );

  dungeon.cells = dungeon.cells.map((c) => (sameCell(cell, c) ? { ...c, loot: loot } : c));
};
