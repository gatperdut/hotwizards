import { HwCampaign } from '../../campaigns/campaign.interface.js';
import { HwCharacter } from '../character.interface.js';

export const giveGold = (
  campaign: HwCampaign,
  character: HwCharacter,
  targetCharacter: HwCharacter,
  amount: number,
): void => {
  character.inventory = {
    ...character.inventory,
    gear: { ...character.inventory.gear },
    backpack: { ...character.inventory.backpack },
  };

  targetCharacter.inventory = {
    ...targetCharacter.inventory,
    gear: { ...targetCharacter.inventory.gear },
    backpack: { ...targetCharacter.inventory.backpack },
  };

  character.inventory.backpack.gold -= amount;
  targetCharacter.inventory.backpack.gold += amount;
};
