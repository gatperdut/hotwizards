import { HwItemCosts } from '../../inventory/item-costs.const.js';
import { HwBuyableItemName } from '../../inventory/item-names.const.js';
import { HwCharacter } from '../character.interface.js';

export const sellItem = (character: HwCharacter, soldItemId: string): void => {
  const soldItem = character.inventory.backpack.items.find((item) => item.id === soldItemId)!;

  character.inventory = {
    ...character.inventory,
    gear: { ...character.inventory.gear },
    backpack: { ...character.inventory.backpack },
  };

  character.inventory.backpack.items = character.inventory.backpack.items.filter(
    (item) => item.id !== soldItemId,
  );
  character.inventory.backpack.gold += Math.round(
    HwItemCosts[soldItem.name as HwBuyableItemName] / 2,
  );
};
