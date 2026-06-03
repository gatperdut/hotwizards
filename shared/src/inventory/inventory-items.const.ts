import { HwInventory } from './inventory.interface.js';
import { HwItem } from './item.interface.js';
import { HwSlots } from './slots.const.js';

export const inventoryItems = (inventory: HwInventory): HwItem[] => {
  return [...HwSlots.map((slot) => inventory.gear[slot]), ...inventory.backpack].filter((i) => !!i);
};
