import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { MembershipsModule } from '../memberships/memberships.module.js';
import { PresenceModule } from '../presence/presence.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { CampaignsController } from './campaigns.controller.js';
import { CampaignsGateway } from './campaigns.gateway.js';
import { CampaignsService } from './campaigns.service.js';
import { CampaignMasterGuard } from './guards/campaign-master.guard.js';
import { CampaignGuard } from './guards/campaign.guard.js';

@Module({
  controllers: [CampaignsController],
  providers: [CampaignsService, CampaignGuard, CampaignMasterGuard, CampaignsGateway],
  imports: [PrismaModule, MembershipsModule, AuthModule, PresenceModule],
  exports: [CampaignsService, CampaignGuard, CampaignMasterGuard],
})
export class CampaignsModule {}
