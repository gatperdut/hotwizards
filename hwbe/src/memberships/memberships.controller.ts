import { User } from '@hw/prismagen/client';
import {
  HwMembership,
  HwMembershipAcceptDto,
  HwMembershipCreateDto,
  HwMembershipsByIdsDto,
} from '@hw/shared';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { OwnedCampaignGuard } from '../campaigns/owned-campaign.guard.js';
import { CurrentUser } from '../users/current-user.decorator.js';
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
  public invite(@CurrentUser() user: User, @Body() params: HwMembershipCreateDto) {
    return this.membershipsService.invite(params.campaignId, user.id, params.userIds);
  }

  @Post('accept')
  public accept(@CurrentUser() user: User, @Body() params: HwMembershipAcceptDto) {
    return this.membershipsService.accept(params.campaignId, user.id, params.klass);
  }
}
