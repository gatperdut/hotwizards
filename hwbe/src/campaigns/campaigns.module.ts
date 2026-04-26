import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { CampaignMasterGuard } from './campaign-master.guard.js';
import { CampaignGuard } from './campaign.guard.js';
import { CampaignsController } from './campaigns.controller.js';
import { CampaignsService } from './campaigns.service.js';

@Module({
  controllers: [CampaignsController],
  providers: [CampaignsService, CampaignGuard, CampaignMasterGuard],
  imports: [PrismaModule],
  exports: [CampaignsService, CampaignGuard, CampaignMasterGuard],
})
export class CampaignsModule {}
