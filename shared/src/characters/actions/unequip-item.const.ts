import { HwSlot } from '../../inventory/slots.const.js';
import { HwCharacter } from '../character.interface.js';

export const unequipItem = (character: HwCharacter, slot: HwSlot): void => {
  const item = character.inventory.gear[slot]!;

  character.inventory.gear[slot] = null;
  character.inventory.backpack.items.unshift(item);

  character.inventory = {
    ...character.inventory,
    gear: { ...character.inventory.gear },
    backpack: { ...character.inventory.backpack },
  };
};
