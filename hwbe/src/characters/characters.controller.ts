import { HwCampaign } from '@hw/shared/campaigns';
import { HwCharacter, HwCharacterUnequipItemDto } from '@hw/shared/characters';
import { HwItem } from '@hw/shared/inventory';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentCampaignStashItem } from '../campaigns/decorators/current-campaign-stash-item.decorator.js';
import { CurrentCampaign } from '../campaigns/decorators/current-campaign.decorator.js';
import { SetCampaignStashItemGuard } from '../campaigns/guards/set-campaign-stash-item.guard.js';
import { CharactersService } from './characters.service.js';
import { CurrentBackpackItem } from './decorators/current-backpack-item.decorator.js';
import { CurrentCharacter } from './decorators/current-character.decorator.js';
import { SetCharacterBackpackItemGuard } from './guards/set-character-backpack-item.guard.js';
import { SetCharacterCampaignGuard } from './guards/set-character-campaign.guard.js';
import { SetCharacterGearItemGuard } from './guards/set-character-gear-item.guard.js';
import { SetCharacterGuard } from './guards/set-character.guard.js';

@Controller('characters')
export class CharactersController {
  constructor(private charactersService: CharactersService) {}

  @Post(':characterId/equip-item')
  @UseGuards(SetCharacterGuard, SetCharacterCampaignGuard, SetCharacterBackpackItemGuard)
  public equipItem(
    @CurrentCharacter() character: HwCharacter,
    @CurrentCampaign() campaign: HwCampaign,
    @CurrentBackpackItem() backpackItem: HwItem,
  ): Promise<void> {
    return this.charactersService.equipItem(campaign, character, backpackItem);
  }

  @Post(':characterId/unequip-item')
  @UseGuards(SetCharacterGuard, SetCharacterCampaignGuard, SetCharacterGearItemGuard)
  public unequipItem(
    @CurrentCharacter() character: HwCharacter,
    @CurrentCampaign() campaign: HwCampaign,
    @Body() body: HwCharacterUnequipItemDto,
  ): Promise<void> {
    return this.charactersService.unequipItem(campaign, character, body.slot);
  }

  @Post(':characterId/drop-item')
  @UseGuards(SetCharacterGuard, SetCharacterCampaignGuard, SetCharacterBackpackItemGuard)
  public dropItem(
    @CurrentCharacter() character: HwCharacter,
    @CurrentCampaign() campaign: HwCampaign,
    @CurrentBackpackItem() backpackItem: HwItem,
  ): Promise<void> {
    return this.charactersService.dropItem(campaign, character, backpackItem);
  }

  @Post(':characterId/pickup-item')
  @UseGuards(SetCharacterGuard, SetCharacterCampaignGuard, SetCampaignStashItemGuard)
  public pickupItem(
    @CurrentCharacter() character: HwCharacter,
    @CurrentCampaign() campaign: HwCampaign,
    @CurrentCampaignStashItem() stashItem: HwItem,
  ): Promise<void> {
    return this.charactersService.pickupItem(campaign, character, stashItem);
  }
}
