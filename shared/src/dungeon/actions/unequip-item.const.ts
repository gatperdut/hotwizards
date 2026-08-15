import { HwSlot } from '../../inventory/slots.const.js';
import { HwDungeon } from '../dungeon.interface.js';

export const unequipItem = (dungeon: HwDungeon, heroId: number, slot: HwSlot): boolean => {
  const hero = dungeon.heroes.find((h) => h.id === heroId)!;
  const inventory = hero.inventory;

  const gearItem = inventory.gear[slot]!;

  inventory.backpack.items.push(gearItem);
  inventory.gear[slot] = null;

  dungeon.heroes = dungeon.heroes.map((h) => {
    if (h.id !== heroId) {
      return h;
    }

    return {
      ...h,
      movementPoints: h.movementPoints - 1,
      inventory: { gear: { ...inventory.gear }, backpack: { ...inventory.backpack } },
    };
  });

  return true;
};
