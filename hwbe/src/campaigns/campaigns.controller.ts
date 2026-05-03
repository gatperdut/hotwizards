import { User } from '@hw/prismagen/client';
import {
  HwCampaign,
  HwCampaignEditDto,
  HwCampaignSearchDto,
  HwMembershipCreateDto,
  HwStartAdventureDto,
  HwUser,
  Paginated,
} from '@hw/shared';
import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { MembershipsService } from '../memberships/memberships.service.js';
import { CurrentUser } from '../users/current-user.decorator.js';
import { CampaignsService } from './campaigns.service.js';
import { CurrentCampaign } from './decorators/current-campaign.decorator.js';
import { CampaignAdventureNotPresentGuard } from './guards/campaign-adventure-not-present.guard.js';
import { CampaignMasterGuard } from './guards/campaign-master.guard.js';
import { SetCampaignGuard } from './guards/set-campaign.guard.js';

@Controller('campaigns')
export class CampaignsController {
  constructor(
    private campaignsService: CampaignsService,
    private membershipsService: MembershipsService,
  ) {}

  @Get()
  public search(
    @CurrentUser() user: HwUser,
    @Query() params: HwCampaignSearchDto,
  ): Promise<Paginated<HwCampaign>> {
    return this.campaignsService.search(user.id, params.term, params.page, params.pageSize);
  }

  @Get(':campaignId')
  @UseGuards(SetCampaignGuard)
  public get(@CurrentCampaign() campaign: HwCampaign): HwCampaign {
    return campaign;
  }

  @Post()
  public create(@CurrentUser() user: User, @Body() body: HwCampaignEditDto): Promise<number> {
    return this.campaignsService.create(user.id, body.name, body.aoo, body.movement);
  }

  @Patch(':campaignId')
  @UseGuards(SetCampaignGuard, CampaignMasterGuard)
  public update(
    @CurrentCampaign() campaign: HwCampaign,
    @Body() body: HwCampaignEditDto,
  ): Promise<number> {
    return this.campaignsService.update(campaign, body.name, body.aoo, body.movement);
  }

  @Delete(':campaignId')
  @UseGuards(SetCampaignGuard, CampaignMasterGuard)
  public delete(@CurrentCampaign() campaign: HwCampaign): Promise<number> {
    return this.campaignsService.delete(campaign);
  }

  @Post(':campaignId/memberships')
  @UseGuards(SetCampaignGuard, CampaignMasterGuard, CampaignAdventureNotPresentGuard)
  public invite(
    @CurrentCampaign() campaign: HwCampaign,
    @Body() params: HwMembershipCreateDto,
  ): Promise<number[]> {
    return this.membershipsService.create(campaign, params.userIds);
  }

  @Post(':campaignId/adventure')
  @UseGuards(SetCampaignGuard, CampaignMasterGuard, CampaignAdventureNotPresentGuard)
  public startAdventure(
    @CurrentCampaign() campaign: HwCampaign,
    @Body() params: HwStartAdventureDto,
  ): Promise<number> {
    return this.campaignsService.startAdventure(campaign, params.adventureTemplateId);
  }
}
