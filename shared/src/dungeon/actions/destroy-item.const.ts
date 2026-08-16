import { HwDungeon } from '../dungeon.interface.js';

export const destroyItem = (dungeon: HwDungeon, heroId: number, backpackItemId: string): void => {
  const hero = dungeon.heroes.find((h) => h.id === heroId)!;

  hero.inventory.backpack.items = hero.inventory.backpack.items.filter(
    (item) => item.id !== backpackItemId,
  );

  dungeon.heroes = dungeon.heroes.map((h) => {
    if (h.id !== heroId) {
      return h;
    }

    return {
      ...h,
      inventory: { gear: { ...hero.inventory.gear }, backpack: { ...hero.inventory.backpack } },
    };
  });
};
