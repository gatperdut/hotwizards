import { HwCampaign } from '../../campaigns/campaign.interface.js';
import { HwCharacter } from '../character.interface.js';

export const pickupGold = (campaign: HwCampaign, character: HwCharacter, amount: number): void => {
  character.inventory = {
    ...character.inventory,
    gear: { ...character.inventory.gear },
    backpack: { ...character.inventory.backpack },
  };
  campaign.stash = { ...campaign.stash };

  campaign.stash.gold -= amount;
  character.inventory.backpack.gold += amount;
};
