import { Module } from '@nestjs/common';
import { CampaignsModule } from '../campaigns/campaigns.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { MembershipActiveGuard } from './membership-active.guard.js';
import { MembershipMasterGuard } from './membership-master.guard.js';
import { MembershipOwnerOrMasterGuard } from './membership-owner-or-master.guard.js';
import { MembershipOwnerGuard } from './membership-owner.guard.js';
import { MembershipPendingGuard } from './membership-pending.guard.js';
import { MembershipsController } from './memberships.controller.js';
import { MembershipsService } from './memberships.service.js';

@Module({
  controllers: [MembershipsController],
  providers: [
    MembershipsService,
    MembershipOwnerGuard,
    MembershipMasterGuard,
    MembershipOwnerOrMasterGuard,
    MembershipActiveGuard,
    MembershipPendingGuard,
  ],
  imports: [PrismaModule, CampaignsModule],
  exports: [MembershipsService],
})
export class MembershipsModule {}
