import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { MembershipActiveGuard } from './guards/membership-active.guard.js';
import { MembershipMasterGuard } from './guards/membership-master.guard.js';
import { MembershipOwnerOrMasterGuard } from './guards/membership-owner-or-master.guard.js';
import { MembershipOwnerGuard } from './guards/membership-owner.guard.js';
import { MembershipPendingGuard } from './guards/membership-pending.guard.js';
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
  imports: [PrismaModule],
  exports: [MembershipsService],
})
export class MembershipsModule {}
