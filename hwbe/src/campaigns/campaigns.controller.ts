import { User } from '@hw/prismagen/client';
import { HwCampaign, HwCampaignEditDto, HwCampaignSearchDto, Paginated } from '@hw/shared';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
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

  @Post()
  public create(@CurrentUser() user: User, @Body() params: HwCampaignEditDto) {
    return this.campaignsService.create(user.id, params.name, params.aoo, params.movement);
  }
}
