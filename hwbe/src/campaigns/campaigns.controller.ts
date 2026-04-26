import { Campaign, User } from '@hw/prismagen/client';
import { HwCampaign, HwCampaignEditDto, HwCampaignSearchDto, Paginated } from '@hw/shared';
import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../users/current-user.decorator.js';
import { CampaignMasterGuard } from './campaign-master.guard.js';
import { CampaignGuard } from './campaign.guard.js';
import { CampaignsService } from './campaigns.service.js';
import { CurrentCampaign } from './current-campaign.decorator.js';

@Controller('campaigns')
export class CampaignsController {
  constructor(private campaignsService: CampaignsService) {}

  @Get()
  public search(
    @CurrentUser() user: User,
    @Query() params: HwCampaignSearchDto,
  ): Promise<Paginated<HwCampaign>> {
    return this.campaignsService.search(user.id, params.term, params.page, params.pageSize);
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
}
