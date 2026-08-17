import { HwItemCosts } from '../../inventory/item-costs.const.js';
import { HwItem } from '../../inventory/item.interface.js';
import { HwCharacter } from '../character.interface.js';

export const buyItem = (character: HwCharacter, boughtItem: HwItem): void => {
  character.inventory = {
    ...character.inventory,
    gear: { ...character.inventory.gear },
    backpack: { ...character.inventory.backpack },
  };

  character.inventory.backpack.gold -= HwItemCosts[boughtItem.name];
  character.inventory.backpack.items.unshift(boughtItem);
};
