import { Campaign, User } from '@hw/prismagen/client';
import {
  HwCampaign,
  HwCampaignEditDto,
  HwCampaignSearchDto,
  HwMembershipCreateDto,
  Paginated,
} from '@hw/shared';
import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AdventureNotPresent } from '../adventures/adventure-not-present.guard.js';
import { MembershipsService } from '../memberships/memberships.service.js';
import { CurrentUser } from '../users/current-user.decorator.js';
import { CampaignsService } from './campaigns.service.js';
import { CurrentCampaign } from './current-campaign.decorator.js';
import { CampaignMasterGuard } from './guards/campaign-master.guard.js';
import { CampaignGuard } from './guards/campaign.guard.js';

@Controller('campaigns')
export class CampaignsController {
  constructor(
    private campaignsService: CampaignsService,
    private membershipsService: MembershipsService,
  ) {}

  @Get()
  public search(
    @CurrentUser() user: User,
    @Query() params: HwCampaignSearchDto,
  ): Promise<Paginated<HwCampaign>> {
    return this.campaignsService.search(user.id, params.term, params.page, params.pageSize);
  }

  @Get(':campaignId')
  @UseGuards(CampaignGuard)
  public get(
    @CurrentUser() user: User,
    @CurrentCampaign() campaign: Campaign,
  ): Promise<HwCampaign> {
    return this.campaignsService.get(campaign.id, user.id);
  }

  @Post()
  public create(@CurrentUser() user: User, @Body() body: HwCampaignEditDto): Promise<number> {
    return this.campaignsService.create(user.id, body.name, body.aoo, body.movement);
  }

  @Patch(':campaignId')
  @UseGuards(CampaignGuard, CampaignMasterGuard)
  public update(
    @CurrentCampaign() campaign: Campaign,
    @Body() body: HwCampaignEditDto,
  ): Promise<number> {
    return this.campaignsService.update(campaign.id, body.name, body.aoo, body.movement);
  }

  @Delete(':campaignId')
  @UseGuards(CampaignGuard, CampaignMasterGuard)
  public delete(@CurrentCampaign() campaign: Campaign): Promise<number> {
    return this.campaignsService.delete(campaign.id);
  }

  @Post(':campaignId/memberships')
  @UseGuards(CampaignGuard, CampaignMasterGuard, AdventureNotPresent)
  public invite(
    @CurrentUser() user: User,
    @CurrentCampaign() campaign: Campaign,
    @Body() params: HwMembershipCreateDto,
  ): Promise<number[]> {
    return this.membershipsService.create(campaign.id, user.id, params.userIds);
  }
}
