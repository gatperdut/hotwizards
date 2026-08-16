import { cellAt } from '../cells/position/cell-at.const.js';
import { sameCell } from '../cells/position/same-cell.const.js';
import { HwDungeon } from '../dungeon.interface.js';

export const dropItem = (dungeon: HwDungeon, heroId: number, backpackItemId: string): void => {
  const hero = dungeon.heroes.find((h) => h.id === heroId)!;
  const backpackItem = hero.inventory.backpack.items.find((item) => item.id === backpackItemId)!;

  const cell = cellAt(dungeon.cells, hero.x, hero.y)!;
  const loot = { ...cell.loot };

  hero.inventory.backpack.items = hero.inventory.backpack.items.filter(
    (i) => i.id !== backpackItem.id,
  );
  loot.items.push(backpackItem);

  dungeon.heroes = dungeon.heroes.map((h) =>
    h.id === hero.id
      ? {
          ...h,
          inventory: { gear: { ...hero.inventory.gear }, backpack: { ...hero.inventory.backpack } },
          movementPoints: h.movementPoints - 1,
        }
      : h,
  );

  dungeon.cells = dungeon.cells.map((c) => (sameCell(cell, c) ? { ...c, loot: { ...loot } } : c));
};
