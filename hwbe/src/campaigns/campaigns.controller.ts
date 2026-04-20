import { User } from '@hw/prismagen/client';
import { HwCampaign, HwCampaignSearchDto, Paginated } from '@hw/shared';
import { Controller, Get, Query } from '@nestjs/common';
import { CurrentUser } from '../users/current-user.decorator.js';
import { CampaignsService } from './campaigns.service.js';

@Controller('campaigns')
export class CampaignsController {
  constructor(private campaignsService: CampaignsService) {}

  @Get('mine')
  public mine(
    @CurrentUser() user: User,
    @Query() params: HwCampaignSearchDto,
  ): Promise<Paginated<HwCampaign>> {
    return this.campaignsService.search(user.id, params.term, params.page, params.pageSize);
  }
}
