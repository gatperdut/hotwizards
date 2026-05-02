import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { MembershipsModule } from '../memberships/memberships.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { CampaignsController } from './campaigns.controller.js';
import { CampaignsGateway } from './campaigns.gateway.js';
import { CampaignsService } from './campaigns.service.js';
import { CampaignMasterGuard } from './guards/campaign-master.guard.js';
import { SetCampaignGuard } from './guards/set-campaign.guard.js';

@Module({
  controllers: [CampaignsController],
  providers: [CampaignsService, SetCampaignGuard, CampaignMasterGuard, CampaignsGateway],
  imports: [PrismaModule, AuthModule, MembershipsModule],
  exports: [CampaignsService, SetCampaignGuard, CampaignMasterGuard],
})
export class CampaignsModule {}
