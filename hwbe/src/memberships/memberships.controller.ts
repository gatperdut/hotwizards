import { Membership, User } from '@hw/prismagen/client';
import {
  HwMembership,
  HwMembershipActivateDto,
  HwMembershipCreateDto,
  HwMembershipsByIdsDto,
} from '@hw/shared';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentCampaignGuard } from '../campaigns/current-campaign.guard.js';
import { MasteredCampaignGuard } from '../campaigns/mastered-campaign.guard.js';
import { CurrentUser } from '../users/current-user.decorator.js';
import { CurrentMembership } from './current-membership.decorator.js';
import { CurrentMembershipGuard } from './current-membership.guard.js';
import { MembershipsService } from './memberships.service.js';
import { PendingMembershipGuard } from './pending-membership.guard.js';

@Controller('memberships')
export class MembershipsController {
  constructor(private membershipsService: MembershipsService) {}

  @Get('by-ids')
  public byIds(@Query() params: HwMembershipsByIdsDto): Promise<HwMembership[]> {
    return this.membershipsService.byIds(params.ids);
  }

  @Post()
  @UseGuards(CurrentCampaignGuard, MasteredCampaignGuard)
  public invite(@CurrentUser() user: User, @Body() params: HwMembershipCreateDto) {
    return this.membershipsService.invite(params.campaignId, user.id, params.userIds);
  }

  @Post('activate')
  @UseGuards(CurrentCampaignGuard, CurrentMembershipGuard, PendingMembershipGuard)
  public activate(
    @CurrentMembership() membership: Membership,
    @Body() params: HwMembershipActivateDto,
  ) {
    return this.membershipsService.activate(membership.id, params.klass);
  }
}
