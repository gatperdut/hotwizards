import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { MembershipActiveGuard } from './guards/membership-active.guard.js';
import { MembershipMasterGuard } from './guards/membership-master.guard.js';
import { MembershipOwnerGuard } from './guards/membership-owner.guard.js';
import { MembershipPendingGuard } from './guards/membership-pending.guard.js';
import { MembershipsController } from './memberships.controller.js';
import { MembershipsGateway } from './memberships.gateway.js';
import { MembershipsService } from './memberships.service.js';

@Module({
  controllers: [MembershipsController],
  providers: [
    MembershipsService,
    MembershipOwnerGuard,
    MembershipMasterGuard,
    MembershipActiveGuard,
    MembershipPendingGuard,
    MembershipsGateway,
  ],
  imports: [PrismaModule, AuthModule],
  exports: [MembershipsService],
})
export class MembershipsModule {}
