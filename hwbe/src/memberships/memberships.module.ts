import { Module } from '@nestjs/common';
import { CampaignsModule } from '../campaigns/campaigns.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ActiveMembershipGuard } from './active-membership.guard.js';
import { CurrentMembershipGuard } from './current-membership.guard.js';
import { MembershipsController } from './memberships.controller.js';
import { MembershipsService } from './memberships.service.js';
import { PendingMembershipGuard } from './pending-membership.guard.js';

@Module({
  controllers: [MembershipsController],
  providers: [
    MembershipsService,
    CurrentMembershipGuard,
    ActiveMembershipGuard,
    PendingMembershipGuard,
  ],
  imports: [PrismaModule, CampaignsModule],
  exports: [
    MembershipsService,
    CurrentMembershipGuard,
    ActiveMembershipGuard,
    PendingMembershipGuard,
  ],
})
export class MembershipsModule {}
