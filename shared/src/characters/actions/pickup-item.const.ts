import { HwCampaign } from '../../campaigns/campaign.interface.js';
import { HwCharacter } from '../character.interface.js';

export const pickupItem = (
  campaign: HwCampaign,
  character: HwCharacter,
  stashItemId: string,
): void => {
  const stashItem = campaign.stash.items.find((item) => item.id === stashItemId)!;

  character.inventory = {
    ...character.inventory,
    gear: { ...character.inventory.gear },
    backpack: { ...character.inventory.backpack },
  };
  campaign.stash = { ...campaign.stash };

  campaign.stash.items = campaign.stash.items.filter((item) => item.id !== stashItemId);
  character.inventory.backpack.items.unshift(stashItem);
};
