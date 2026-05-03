import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module.js';
import { MembershipsModule } from '../memberships/memberships.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { PushModule } from '../push/push.module.js';
import { CampaignsController } from './campaigns.controller.js';
import { CampaignsGateway } from './campaigns.gateway.js';
import { CampaignsService } from './campaigns.service.js';

@Module({
  controllers: [CampaignsController],
  providers: [CampaignsService, CampaignsGateway],
  imports: [PrismaModule, AuthModule, MembershipsModule, PushModule, ConfigModule],
  exports: [],
})
export class CampaignsModule {}
