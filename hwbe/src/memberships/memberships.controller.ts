import { Membership } from '@hw/prismagen/client';
import { HwMembershipAcceptDto } from '@hw/shared';
import { Body, Controller, Delete, Patch, UseGuards } from '@nestjs/common';
import { CurrentMembership } from './current-membership.decorator.js';
import { MembershipOwnerOrMasterGuard } from './guards/membership-owner-or-master.guard.js';
import { MembershipOwnerGuard } from './guards/membership-owner.guard.js';
import { MembershipPendingGuard } from './guards/membership-pending.guard.js';
import { MembershipGuard } from './guards/membership.guard.js';
import { MembershipsService } from './memberships.service.js';

@Controller('memberships')
export class MembershipsController {
  constructor(private membershipsService: MembershipsService) {}

  @Patch(':membershipId')
  @UseGuards(MembershipGuard, MembershipOwnerGuard, MembershipPendingGuard)
  public accept(
    @CurrentMembership() membership: Membership,
    @Body() params: HwMembershipAcceptDto,
  ): Promise<number> {
    return this.membershipsService.accept(membership.id, params.klass, params.gender, params.name);
  }

  @Delete(':membershipId')
  @UseGuards(MembershipGuard, MembershipOwnerOrMasterGuard)
  public delete(@CurrentMembership() membership: Membership): Promise<number> {
    return this.membershipsService.delete(membership.id);
  }
}
