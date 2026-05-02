import { HwCampaign, HwMembership, HwMembershipAcceptDto } from '@hw/shared';
import { Body, Controller, Delete, Patch, UseGuards } from '@nestjs/common';
import { CurrentMembershipCampaign } from './decorators/current-membership-campaign.decorator.js';
import { CurrentMembership } from './decorators/current-membership.decorator.js';
import { MembershipAdventureNotPresentGuard } from './guards/membership-adventure-not-present.guard.js';
import { MembershipMasterGuard } from './guards/membership-master.guard.js';
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
    @CurrentMembership() membership: HwMembership,
    @Body() params: HwMembershipAcceptDto,
  ): Promise<number> {
    return this.membershipsService.accept(membership, params.klass, params.gender, params.name);
  }

  @Delete(':membershipId')
  @UseGuards(
    SetMembershipGuard,
    SetMembershipCampaignGuard,
    MembershipMasterGuard,
    MembershipAdventureNotPresentGuard,
  )
  public kickout(
    @CurrentMembership() membership: HwMembership,
    @CurrentMembershipCampaign() campaign: HwCampaign,
  ): Promise<number> {
    return this.membershipsService.delete(membership, campaign, false);
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
    @CurrentMembershipCampaign() campaign: HwCampaign,
  ): Promise<number> {
    return this.membershipsService.delete(membership, campaign, true);
  }
}
