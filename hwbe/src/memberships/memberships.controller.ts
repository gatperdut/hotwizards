import { Campaign } from '@hw/prismagen/client';
import { HwMembership, HwMembershipCreateDto, HwMembershipsByIdsDto } from '@hw/shared';
import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { OwnedCampaign } from '../campaigns/owned-campaign.decorator.js';
import { OwnedCampaignGuard } from '../campaigns/owned-campaign.guard.js';
import { MembershipsService } from './memberships.service.js';

@Controller('memberships')
export class MembershipsController {
  constructor(private membershipsService: MembershipsService) {}

  @Get('by-ids')
  public byIds(@Query() params: HwMembershipsByIdsDto): Promise<HwMembership[]> {
    return this.membershipsService.byIds(params.ids);
  }

  @Post()
  @UseGuards(OwnedCampaignGuard)
  public invite(@OwnedCampaign() campaign: Campaign, params: HwMembershipCreateDto) {
    return this.membershipsService.invite(campaign.id, params.userIds);
  }
}
