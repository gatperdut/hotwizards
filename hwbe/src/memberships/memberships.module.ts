import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { PushModule } from '../push/push.module.js';
import { MembershipsController } from './memberships.controller.js';
import { MembershipsGateway } from './memberships.gateway.js';
import { MembershipsService } from './memberships.service.js';

@Module({
  controllers: [MembershipsController],
  providers: [MembershipsService, MembershipsGateway],
  imports: [PrismaModule, AuthModule, PushModule],
  exports: [MembershipsService],
})
export class MembershipsModule {}
