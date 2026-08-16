import {
  HwAdventure,
  HwAdventureMoveHeroDto,
  HwAdventureMoveMonsterDto,
  HwAdventureOpenDoorDto,
  HwAdventurePickupGoldDto,
  HwAdventureSelectMonsterDto,
  HwAdventureUnequipItemDto,
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
import { CurrentLootItem } from './decorators/current-loot-item.decorator.js';
import { CurrentMonster } from './decorators/current-monster.decorator.js';
import { AdventureCampaignMasterGuard } from './guards/adventure-campaign-master.guard.js';
import { AdventureProperTurnGuard } from './guards/adventure-proper-turn.guard.js';
import { HeroBackpackItemEquippableGuard } from './guards/backpack-item-equippable.guard.js';
import { HeroHasActionPoints } from './guards/hero-has-action-points.guard.js';
import { HeroHasMovementPointsGuard } from './guards/hero-has-movement-points.guard.js';
import { MonsterHasMovementPoints } from './guards/monster-has-movement-points.guard.js';
import { SetAdventureCampaignGuard } from './guards/set-adventure-campaign.guard.js';
import { SetAdventureHeroGuard } from './guards/set-adventure-hero.guard.js';
import { SetAdventureMonsterGuard } from './guards/set-adventure-monster.guard.js';
import { SetAdventureGuard } from './guards/set-adventure.guard.js';
import { SetHeroBackpackItemGuard } from './guards/set-hero-backpack-item.guard.js';
import { SetHeroGearItemGuard } from './guards/set-hero-gear-item.guard.js';
import { SetHeroLootItemGuard } from './guards/set-hero-loot-item.guard.js';

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
  public endTurnMaster(@CurrentCampaign() campaign: HwCampaign): Promise<number> {
    return this.adventuresService.endTurnMaster(campaign);
  }

  @Post(':adventureId/end-turn/hero')
  @UseGuards(SetAdventureGuard, SetAdventureCampaignGuard, AdventureProperTurnGuard)
  public endTurnHero(
    @CurrentUser() user: HwUser,
    @CurrentCampaign() campaign: HwCampaign,
  ): Promise<number> {
    return this.adventuresService.endTurnHero(user, campaign);
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
    @CurrentCampaign() campaign: HwCampaign,
    @Body() body: HwAdventureSelectMonsterDto,
  ): void {
    this.adventuresGateway.handleDownSelectMonster(campaign.id, body.monsterId);
  }

  @Post(':adventureId/move-hero')
  @UseGuards(
    SetAdventureGuard,
    SetAdventureCampaignGuard,
    AdventureProperTurnGuard,
    SetAdventureHeroGuard,
    HeroHasMovementPointsGuard,
  )
  public moveHero(
    @CurrentCampaign() campaign: HwCampaign,
    @CurrentHero() hero: HwHero,
    @Body() body: HwAdventureMoveHeroDto,
  ): Promise<void> {
    return this.adventuresService.moveHero(campaign, hero, body.adjacent);
  }

  @Post(':adventureId/move-monster')
  @UseGuards(
    SetAdventureGuard,
    SetAdventureCampaignGuard,
    AdventureProperTurnGuard,
    SetAdventureMonsterGuard,
    MonsterHasMovementPoints,
  )
  public moveMonster(
    @CurrentCampaign() campaign: HwCampaign,
    @CurrentMonster() monster: HwMonster,
    @Body() body: HwAdventureMoveMonsterDto,
  ): Promise<void> {
    return this.adventuresService.moveMonster(campaign, monster, body.adjacent);
  }

  @Post(':adventureId/open-door')
  @UseGuards(
    SetAdventureGuard,
    SetAdventureCampaignGuard,
    AdventureProperTurnGuard,
    SetAdventureHeroGuard,
    HeroHasMovementPointsGuard,
  )
  public openDoor(
    @CurrentCampaign() campaign: HwCampaign,
    @CurrentHero() hero: HwHero,
    @Body() body: HwAdventureOpenDoorDto,
  ): Promise<void> {
    return this.adventuresService.openDoor(campaign, hero, body.adjacent);
  }

  @Post(':adventureId/equip-item')
  @UseGuards(
    SetAdventureGuard,
    SetAdventureCampaignGuard,
    AdventureProperTurnGuard,
    SetAdventureHeroGuard,
    HeroHasMovementPointsGuard,
    SetHeroBackpackItemGuard,
    HeroBackpackItemEquippableGuard,
  )
  public equipItem(
    @CurrentCampaign() campaign: HwCampaign,
    @CurrentHero() hero: HwHero,
    @CurrentBackpackItem() backpackItem: HwItem,
  ): Promise<void> {
    return this.adventuresService.equipItem(campaign, hero, backpackItem);
  }

  @Post(':adventureId/unequip-item')
  @UseGuards(
    SetAdventureGuard,
    SetAdventureCampaignGuard,
    AdventureProperTurnGuard,
    SetAdventureHeroGuard,
    HeroHasMovementPointsGuard,
    SetHeroGearItemGuard,
  )
  public unequipItem(
    @CurrentCampaign() campaign: HwCampaign,
    @CurrentHero() hero: HwHero,
    @Body() body: HwAdventureUnequipItemDto,
  ): Promise<void> {
    return this.adventuresService.unequipItem(campaign, hero, body.slot);
  }

  @Post(':adventureId/drop-item')
  @UseGuards(
    SetAdventureGuard,
    SetAdventureCampaignGuard,
    AdventureProperTurnGuard,
    SetAdventureHeroGuard,
    HeroHasMovementPointsGuard,
    SetHeroBackpackItemGuard,
  )
  public dropItem(
    @CurrentCampaign() campaign: HwCampaign,
    @CurrentHero() hero: HwHero,
    @CurrentBackpackItem() backpackItem: HwItem,
  ): Promise<void> {
    return this.adventuresService.dropItem(campaign, hero, backpackItem);
  }

  @Post(':adventureId/destroy-item')
  @UseGuards(
    SetAdventureGuard,
    SetAdventureCampaignGuard,
    AdventureProperTurnGuard,
    SetAdventureHeroGuard,
    SetHeroBackpackItemGuard,
  )
  public destroyItem(
    @CurrentCampaign() campaign: HwCampaign,
    @CurrentHero() hero: HwHero,
    @CurrentBackpackItem() backpackItem: HwItem,
  ): Promise<void> {
    return this.adventuresService.destroyItem(campaign, hero, backpackItem);
  }

  @Post(':adventureId/pickup-item')
  @UseGuards(
    SetAdventureGuard,
    SetAdventureCampaignGuard,
    AdventureProperTurnGuard,
    SetAdventureHeroGuard,
    HeroHasMovementPointsGuard,
    SetHeroLootItemGuard,
  )
  public pickupItem(
    @CurrentCampaign() campaign: HwCampaign,
    @CurrentHero() hero: HwHero,
    @CurrentLootItem() lootItem: HwItem,
  ): Promise<void> {
    return this.adventuresService.pickupItem(campaign, hero, lootItem);
  }

  @Post(':adventureId/pickup-gold')
  @UseGuards(
    SetAdventureGuard,
    SetAdventureCampaignGuard,
    AdventureProperTurnGuard,
    SetAdventureHeroGuard,
    HeroHasMovementPointsGuard,
  )
  public pickupGold(
    @CurrentCampaign() campaign: HwCampaign,
    @CurrentHero() hero: HwHero,
    @Body() body: HwAdventurePickupGoldDto,
  ): Promise<void> {
    return this.adventuresService.pickupGold(campaign, hero, body.amount);
  }

  @Post(':adventureId/search')
  @UseGuards(
    SetAdventureGuard,
    SetAdventureCampaignGuard,
    AdventureProperTurnGuard,
    SetAdventureHeroGuard,
    HeroHasActionPoints,
  )
  public search(
    @CurrentCampaign() campaign: HwCampaign,
    @CurrentHero() hero: HwHero,
  ): Promise<void> {
    return this.adventuresService.search(campaign, hero);
  }
}
