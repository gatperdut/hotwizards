import { HwAdventure, HwCampaign } from '@hw/shared';
import { Controller, Delete, UseGuards } from '@nestjs/common';
import { CurrentCampaign } from '../campaigns/decorators/current-campaign.decorator.js';
import { CampaignMasterGuard } from '../campaigns/guards/campaign-master.guard.js';
import { AdventuresService } from './adventures.service.js';
import { CurrentAdventure } from './decorators/current-adventure.decorator.js';
import { SetAdventureCampaignGuard } from './guards/set-adventure-campaign.guard.js';
import { SetAdventureGuard } from './guards/set-adventure.guard.js';

@Controller('adventures')
export class AdventuresController {
  constructor(private adventuresService: AdventuresService) {}

  @Delete(':adventureId')
  @UseGuards(SetAdventureGuard, SetAdventureCampaignGuard, CampaignMasterGuard)
  public finishAdventure(
    @CurrentCampaign() campaign: HwCampaign,
    @CurrentAdventure() adventure: HwAdventure,
  ): Promise<number> {
    return this.adventuresService.finishAdventure(campaign, adventure);
  }
}
