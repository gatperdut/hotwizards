import { Membership, User } from '@hw/prismagen/client';
import { HwMembershipAcceptDto, HwMembershipCreateDto } from '@hw/shared';
import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { CampaignMasterGuard } from '../campaigns/campaign-master.guard.js';
import { CampaignGuard } from '../campaigns/campaign.guard.js';
import { CurrentUser } from '../users/current-user.decorator.js';
import { CurrentMembership } from './current-membership.decorator.js';
import { MembershipOwnerOrMasterGuard } from './membership-owner-or-master.guard.js';
import { MembershipOwnerGuard } from './membership-owner.guard.js';
import { MembershipPendingGuard } from './membership-pending.guard.js';
import { MembershipsService } from './memberships.service.js';

@Controller('memberships')
export class MembershipsController {
  constructor(private membershipsService: MembershipsService) {}

  @Post()
  @UseGuards(CampaignGuard, CampaignMasterGuard)
  public create(
    @CurrentUser() user: User,
    @Body() params: HwMembershipCreateDto,
  ): Promise<number[]> {
    return this.membershipsService.create(params.campaignId, user.id, params.userIds);
  }

  @Post('accept')
  @UseGuards(MembershipOwnerGuard, MembershipPendingGuard)
  public accept(
    @CurrentMembership() membership: Membership,
    @Body() params: HwMembershipAcceptDto,
  ): Promise<number> {
    return this.membershipsService.accept(membership.id, params.klass, params.gender, params.name);
  }

  @Delete()
  @UseGuards(MembershipOwnerOrMasterGuard)
  public delete(@CurrentMembership() membership: Membership): Promise<number> {
    return this.membershipsService.delete(membership.id);
  }
}
