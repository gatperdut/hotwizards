import { HwMembership, HwMembershipsByIdsDto } from '@hw/shared';
import { Controller, Get, Query } from '@nestjs/common';
import { MembershipsService } from './memberships.service.js';

@Controller('memberships')
export class MembershipsController {
  constructor(private membershipsService: MembershipsService) {}

  @Get('by-ids')
  public byIds(@Query() params: HwMembershipsByIdsDto): Promise<HwMembership[]> {
    return this.membershipsService.byIds(params.ids);
  }
}
