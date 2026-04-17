import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { MembershipsController } from './memberships.controller.js';
import { MembershipsService } from './memberships.service.js';

@Module({
  controllers: [MembershipsController],
  providers: [MembershipsService],
  imports: [PrismaModule],
  exports: [MembershipsService],
})
export class MembershipsModule {}
