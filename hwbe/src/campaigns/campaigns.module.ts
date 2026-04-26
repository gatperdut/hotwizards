import { Module } from '@nestjs/common';
import { MembershipsModule } from '../memberships/memberships.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { CampaignsController } from './campaigns.controller.js';
import { CampaignsService } from './campaigns.service.js';
import { CampaignMasterGuard } from './guards/campaign-master.guard.js';
import { CampaignGuard } from './guards/campaign.guard.js';

@Module({
  controllers: [CampaignsController],
  providers: [CampaignsService, CampaignGuard, CampaignMasterGuard],
  imports: [PrismaModule, MembershipsModule],
  exports: [CampaignsService, CampaignGuard, CampaignMasterGuard],
})
export class CampaignsModule {}
