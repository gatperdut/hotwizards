import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { CampaignsController } from './campaigns.controller.js';
import { CampaignsService } from './campaigns.service.js';
import { CurrentCampaignGuard } from './current-campaign.guard.js';
import { MasteredCampaignGuard } from './mastered-campaign.guard.js';

@Module({
  controllers: [CampaignsController],
  providers: [CampaignsService, CurrentCampaignGuard, MasteredCampaignGuard],
  imports: [PrismaModule],
  exports: [CampaignsService, CurrentCampaignGuard, MasteredCampaignGuard],
})
export class CampaignsModule {}
