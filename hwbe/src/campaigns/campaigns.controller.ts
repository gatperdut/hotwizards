import { User } from '@hw/prismagen/client';
import {
  HwCampaign,
  HwCampaignCreateDto,
  HwCampaignCreateResponse,
  HwCampaignSearchDto,
  HwCampaignUpdateDto,
  HwCampaignUpdateResponse,
  Paginated,
} from '@hw/shared';
import { Body, Controller, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../users/current-user.decorator.js';
import { CampaignMasterGuard } from './campaign-master.guard.js';
import { CampaignUserGuard } from './campaign-user.guard.js';
import { CampaignsService } from './campaigns.service.js';

@Controller('campaigns')
export class CampaignsController {
  constructor(private campaignsService: CampaignsService) {}

  @Get('mine')
  public mine(
    @CurrentUser() user: User,
    @Query() params: HwCampaignSearchDto,
  ): Promise<Paginated<HwCampaign>> {
    return this.campaignsService.search(user.id, params.term, params.page, params.pageSize);
  }

  @Post()
  public create(
    @CurrentUser() user: User,
    @Body() body: HwCampaignCreateDto,
  ): Promise<HwCampaignCreateResponse> {
    return this.campaignsService.create(user.id, body.name, body.aoo, body.movement);
  }

  @Patch()
  @UseGuards(CampaignUserGuard, CampaignMasterGuard)
  public update(
    @CurrentUser() user: User,
    @Body() body: HwCampaignUpdateDto,
  ): Promise<HwCampaignUpdateResponse> {
    return this.campaignsService.update(body.campaignId, body.name, body.aoo, body.movement);
  }
}
