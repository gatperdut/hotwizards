import { Membership } from '@hw/prismagen/client';
import { HwMembershipAcceptDto } from '@hw/shared';
import { Body, Controller, Delete, Patch, UseGuards } from '@nestjs/common';
import { AdventureNotPresent } from '../adventures/adventure-not-present.guard.js';
import { CurrentMembership } from './current-membership.decorator.js';
import { MembershipMasterGuard } from './guards/membership-master.guard.js';
import { MembershipOwnerGuard } from './guards/membership-owner.guard.js';
import { MembershipPendingGuard } from './guards/membership-pending.guard.js';
import { MembershipGuard } from './guards/membership.guard.js';
import { MembershipsService } from './memberships.service.js';

@Controller('memberships')
export class MembershipsController {
  constructor(private membershipsService: MembershipsService) {}

  @Patch(':membershipId')
  @UseGuards(MembershipGuard, MembershipOwnerGuard, MembershipPendingGuard, AdventureNotPresent)
  public accept(
    @CurrentMembership() membership: Membership,
    @Body() params: HwMembershipAcceptDto,
  ): Promise<number> {
    return this.membershipsService.accept(membership.id, params.klass, params.gender, params.name);
  }

  @Delete(':membershipId')
  @UseGuards(MembershipGuard, MembershipMasterGuard, AdventureNotPresent)
  public kickout(@CurrentMembership() membership: Membership): Promise<number> {
    return this.membershipsService.delete(membership.campaignId, membership.id, false);
  }

  @Delete(':membershipId/self')
  @UseGuards(MembershipGuard, MembershipOwnerGuard, AdventureNotPresent)
  public abandon(@CurrentMembership() membership: Membership): Promise<number> {
    return this.membershipsService.delete(membership.campaignId, membership.id, true);
  }
}
