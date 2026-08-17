import { HwCampaign } from '../../campaigns/campaign.interface.js';
import { HwCharacter } from '../character.interface.js';

export const dropItem = (
  campaign: HwCampaign,
  character: HwCharacter,
  backpackItemId: string,
): void => {
  const backpackItem = character.inventory.backpack.items.find(
    (item) => item.id === backpackItemId,
  )!;

  character.inventory = {
    ...character.inventory,
    gear: { ...character.inventory.gear },
    backpack: { ...character.inventory.backpack },
  };
  campaign.stash = { ...campaign.stash };

  character.inventory.backpack.items = character.inventory.backpack.items.filter(
    (item) => item.id !== backpackItemId,
  );
  campaign.stash.items.push(backpackItem);
};
