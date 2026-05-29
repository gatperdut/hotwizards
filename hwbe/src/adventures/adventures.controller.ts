import {
  HwAdventure,
  HwAdventureMoveHeroDto,
  HwAdventureMoveMonsterDto,
} from '@hw/shared/adventures';
import { HwCampaign } from '@hw/shared/campaigns';
import { HwHero, HwMonster } from '@hw/shared/dungeon';
import { HwUser } from '@hw/shared/users';
import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { CurrentCampaign } from '../campaigns/decorators/current-campaign.decorator.js';
import { CampaignMasterGuard } from '../campaigns/guards/campaign-master.guard.js';
import { CurrentUser } from '../users/current-user.decorator.js';
import { AdventuresService } from './adventures.service.js';
import { CurrentAdventure } from './decorators/current-adventure.decorator.js';
import { CurrentHero } from './decorators/current-hero.decorator.js';
import { CurrentMonster } from './decorators/current-monster.decorator.js';
import { AdventureProperTurnGuard } from './guards/adventure-proper-turn.guard.js';
import { SetAdventureCampaignGuard } from './guards/set-adventure-campaign.guard.js';
import { SetAdventureHeroGuard } from './guards/set-adventure-hero.guard.js';
import { SetAdventureMonsterGuard } from './guards/set-adventure-monster.guard.js';
import { SetAdventureGuard } from './guards/set-adventure.guard.js';

@Controller('adventures')
export class AdventuresController {
  constructor(private adventuresService: AdventuresService) {}

  @Delete(':adventureId')
  @UseGuards(SetAdventureGuard, SetAdventureCampaignGuard, CampaignMasterGuard)
  public finishAdventure(@CurrentAdventure() adventure: HwAdventure): Promise<number> {
    return this.adventuresService.finishAdventure(adventure);
  }

  @Post(':adventureId/end-turn/master')
  @UseGuards(SetAdventureGuard, SetAdventureCampaignGuard, AdventureProperTurnGuard)
  public endTurnMaster(
    @CurrentCampaign() campaign: HwCampaign,
    @CurrentAdventure() adventure: HwAdventure,
  ): Promise<number> {
    return this.adventuresService.endTurnMaster(campaign, adventure);
  }

  @Post(':adventureId/end-turn/hero')
  @UseGuards(SetAdventureGuard, SetAdventureCampaignGuard, AdventureProperTurnGuard)
  public endTurnHero(
    @CurrentUser() user: HwUser,
    @CurrentCampaign() campaign: HwCampaign,
    @CurrentAdventure() adventure: HwAdventure,
  ): Promise<number> {
    return this.adventuresService.endTurnHero(user, campaign, adventure);
  }

  @Post(':adventureId/move-hero')
  @UseGuards(
    SetAdventureGuard,
    SetAdventureCampaignGuard,
    AdventureProperTurnGuard,
    SetAdventureHeroGuard,
  )
  public moveHero(
    @CurrentCampaign() campaign: HwCampaign,
    @CurrentAdventure() adventure: HwAdventure,
    @CurrentHero() hero: HwHero,
    @Body() body: HwAdventureMoveHeroDto,
  ): Promise<void> {
    return this.adventuresService.moveCreature(campaign, adventure, hero, body.direction);
  }

  @Post(':adventureId/move-monster')
  @UseGuards(
    SetAdventureGuard,
    SetAdventureCampaignGuard,
    AdventureProperTurnGuard,
    SetAdventureMonsterGuard,
  )
  public moveMonster(
    @CurrentCampaign() campaign: HwCampaign,
    @CurrentAdventure() adventure: HwAdventure,
    @CurrentMonster() monster: HwMonster,
    @Body() body: HwAdventureMoveMonsterDto,
  ): Promise<void> {
    return this.adventuresService.moveCreature(campaign, adventure, monster, body.direction);
  }
}
