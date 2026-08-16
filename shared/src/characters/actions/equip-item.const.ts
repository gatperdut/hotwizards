import { HwCharacter } from '../../characters/character.interface.js';
import { HwItemSlots } from '../../inventory/item-slots.const.js';

export const equipItem = (character: HwCharacter, backpackItemId: string): void => {
  const backpackItem = character.inventory.backpack.items.find(
    (item) => item.id === backpackItemId,
  )!;

  character.inventory.gear[HwItemSlots[backpackItem.name]!] = backpackItem;
  character.inventory.backpack.items = character.inventory.backpack.items.filter(
    (item) => item.id !== backpackItemId,
  );

  character.inventory = {
    ...character.inventory,
    gear: { ...character.inventory.gear },
    backpack: { ...character.inventory.backpack },
  };
};
