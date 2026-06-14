import {
  HwAdventure,
  HwAdventureMoveHeroDto,
  HwAdventureMoveMonsterDto,
  HwAdventureOpenDoorDto,
  HwAdventureSelectMonsterDto,
} from '@hw/shared/adventures';
import { HwCampaign } from '@hw/shared/campaigns';
import { HwHero, HwMonster } from '@hw/shared/dungeon';
import { HwItem } from '@hw/shared/inventory';
import { HwUser } from '@hw/shared/users';
import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { CurrentCampaign } from '../campaigns/decorators/current-campaign.decorator.js';
import { CampaignMasterGuard } from '../campaigns/guards/campaign-master.guard.js';
import { CurrentBackpackItem } from '../characters/decorators/current-backpack-item.decorator.js';
import { CurrentUser } from '../users/current-user.decorator.js';
import { AdventuresGateway } from './adventures.gateway.js';
import { AdventuresService } from './adventures.service.js';
import { CurrentAdventure } from './decorators/current-adventure.decorator.js';
import { CurrentHero } from './decorators/current-hero.decorator.js';
import { CurrentMonster } from './decorators/current-monster.decorator.js';
import { AdventureCampaignMasterGuard } from './guards/adventure-campaign-master.guard.js';
import { AdventureProperTurnGuard } from './guards/adventure-proper-turn.guard.js';
import { SetAdventureCampaignGuard } from './guards/set-adventure-campaign.guard.js';
import { SetAdventureHeroGuard } from './guards/set-adventure-hero.guard.js';
import { SetAdventureMonsterGuard } from './guards/set-adventure-monster.guard.js';
import { SetAdventureGuard } from './guards/set-adventure.guard.js';
import { SetHeroBackpackItemGuard } from './guards/set-hero-backpack-item.guard.js';

@Controller('adventures')
export class AdventuresController {
  constructor(
    private adventuresService: AdventuresService,
    private adventuresGateway: AdventuresGateway,
  ) {}

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

  @Post(':adventureId/select-monster')
  @UseGuards(
    SetAdventureGuard,
    SetAdventureCampaignGuard,
    SetAdventureCampaignGuard,
    AdventureCampaignMasterGuard,
    AdventureProperTurnGuard,
  )
  public selectMonster(
    @CurrentAdventure() adventure: HwAdventure,
    @Body() body: HwAdventureSelectMonsterDto,
  ): void {
    this.adventuresGateway.handleDownSelectMonster(adventure.campaignId, body.monsterId);
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
    return this.adventuresService.moveHero(campaign, adventure, hero, body.direction);
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
    return this.adventuresService.moveMonster(campaign, adventure, monster, body.direction);
  }

  @Post(':adventureId/open-door')
  @UseGuards(
    SetAdventureGuard,
    SetAdventureCampaignGuard,
    AdventureProperTurnGuard,
    SetAdventureHeroGuard,
  )
  public openDoor(
    @CurrentCampaign() campaign: HwCampaign,
    @CurrentAdventure() adventure: HwAdventure,
    @CurrentHero() hero: HwHero,
    @Body() body: HwAdventureOpenDoorDto,
  ): Promise<void> {
    return this.adventuresService.openDoor(campaign, adventure, hero, body.direction);
  }

  @Post(':adventureId/equip-item')
  @UseGuards(
    SetAdventureGuard,
    SetAdventureCampaignGuard,
    AdventureProperTurnGuard,
    SetAdventureHeroGuard,
    SetHeroBackpackItemGuard,
  )
  public equipItem(
    @CurrentCampaign() campaign: HwCampaign,
    @CurrentAdventure() adventure: HwAdventure,
    @CurrentHero() hero: HwHero,
    @CurrentBackpackItem() backpackItem: HwItem,
  ): Promise<void> {
    return this.adventuresService.equipItem(campaign, adventure, hero, backpackItem);
  }
}
