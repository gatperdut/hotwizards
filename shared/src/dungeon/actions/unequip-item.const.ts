import { HwSlot } from '../../inventory/slots.const.js';
import { HwDungeon } from '../dungeon.interface.js';

export const unequipItem = (dungeon: HwDungeon, heroId: number, slot: HwSlot): void => {
  const hero = dungeon.heroes.find((h) => h.id === heroId)!;
  const gearItem = hero.inventory.gear[slot]!;

  hero.inventory.backpack.items.push(gearItem);
  hero.inventory.gear[slot] = null;

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
};
