import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { CampaignsController } from './campaigns.controller.js';
import { CampaignsService } from './campaigns.service.js';
import { OwnedCampaignGuard } from './owned-campaign.guard.js';

@Module({
  controllers: [CampaignsController],
  providers: [CampaignsService, OwnedCampaignGuard],
  imports: [PrismaModule],
  exports: [CampaignsService, OwnedCampaignGuard],
})
export class CampaignsModule {}
