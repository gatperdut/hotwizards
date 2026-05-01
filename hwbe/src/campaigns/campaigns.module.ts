import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { MembershipsModule } from '../memberships/memberships.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { CampaignsGateway } from './campaigns-list.gateway.js';
import { CampaignsController } from './campaigns.controller.js';
import { CampaignsService } from './campaigns.service.js';
import { CampaignMasterGuard } from './guards/campaign-master.guard.js';
import { CampaignGuard } from './guards/campaign.guard.js';

@Module({
  controllers: [CampaignsController],
  providers: [CampaignsService, CampaignGuard, CampaignMasterGuard, CampaignsGateway],
  imports: [PrismaModule, MembershipsModule, AuthModule],
  exports: [CampaignsService, CampaignGuard, CampaignMasterGuard],
})
export class CampaignsModule {}
