import { HwItemSlots } from '../../inventory/item-slots.const.js';
import { HwDungeon } from '../dungeon.interface.js';

export const equipItem = (dungeon: HwDungeon, heroId: number, backpackItemId: string): boolean => {
  const hero = dungeon.heroes.find((h) => h.id === heroId)!;
  const backpackItem = hero.inventory.backpack.items.find((item) => item.id === backpackItemId)!;

  const slot = HwItemSlots[backpackItem.name];
  if (!slot) {
    return false;
  }

  hero.inventory.gear[slot] = backpackItem;
  hero.inventory.backpack.items = hero.inventory.backpack.items.filter(
    (i) => i.id !== backpackItem.id,
  );

  dungeon.heroes = dungeon.heroes.map((h) =>
    h.id === heroId
      ? {
          ...h,
          inventory: { gear: { ...hero.inventory.gear }, backpack: { ...hero.inventory.backpack } },
          movementPoints: h.movementPoints - 1,
        }
      : h,
  );

  return true;
};
