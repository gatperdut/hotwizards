import { HwCharacter } from '../character.interface.js';

export const destroyItem = (character: HwCharacter, destroyedItemId: string): void => {
  character.inventory = {
    ...character.inventory,
    gear: { ...character.inventory.gear },
    backpack: { ...character.inventory.backpack },
  };

  character.inventory.backpack.items = character.inventory.backpack.items.filter(
    (item) => item.id !== destroyedItemId,
  );
};
