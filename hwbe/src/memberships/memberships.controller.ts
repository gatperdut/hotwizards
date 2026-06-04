import { HwCampaign } from '@hw/shared/campaigns';
import { HwMembership, HwMembershipAcceptDto } from '@hw/shared/memberships';
import { HwUser } from '@hw/shared/users';
import { Body, Controller, Delete, Patch, UseGuards } from '@nestjs/common';
import { CurrentCampaign } from '../campaigns/decorators/current-campaign.decorator.js';
import { CampaignMasterGuard } from '../campaigns/guards/campaign-master.guard.js';
import { CurrentUser } from '../users/current-user.decorator.js';
import { CurrentMembership } from './decorators/current-membership.decorator.js';
import { MembershipAdventureNotPresentGuard } from './guards/membership-adventure-not-present.guard.js';
import { MembershipOwnerGuard } from './guards/membership-owner.guard.js';
import { MembershipPendingGuard } from './guards/membership-pending.guard.js';
import { SetMembershipCampaignGuard } from './guards/set-membership-campaign.guard.js';
import { SetMembershipGuard } from './guards/set-membership.guard.js';
import { MembershipsService } from './memberships.service.js';

@Controller('memberships')
export class MembershipsController {
  constructor(private membershipsService: MembershipsService) {}

  @Patch(':membershipId')
  @UseGuards(
    SetMembershipGuard,
    SetMembershipCampaignGuard,
    MembershipOwnerGuard,
    MembershipPendingGuard,
    MembershipAdventureNotPresentGuard,
  )
  public accept(
    @CurrentUser() user: HwUser,
    @CurrentMembership() membership: HwMembership,
    @Body() params: HwMembershipAcceptDto,
  ): Promise<number> {
    return this.membershipsService.accept(
      user,
      membership,
      params.klass,
      params.gender,
      params.name,
    );
  }

  @Delete(':membershipId')
  @UseGuards(
    SetMembershipGuard,
    SetMembershipCampaignGuard,
    CampaignMasterGuard,
    MembershipAdventureNotPresentGuard,
  )
  public kickout(
    @CurrentMembership() membership: HwMembership,
    @CurrentCampaign() campaign: HwCampaign,
  ): Promise<number> {
    return this.membershipsService.delete(campaign, membership, false);
  }

  @Delete(':membershipId/self')
  @UseGuards(
    SetMembershipGuard,
    SetMembershipCampaignGuard,
    MembershipOwnerGuard,
    MembershipAdventureNotPresentGuard,
  )
  public abandon(
    @CurrentMembership() membership: HwMembership,
    @CurrentCampaign() campaign: HwCampaign,
  ): Promise<number> {
    return this.membershipsService.delete(campaign, membership, true);
  }
}
