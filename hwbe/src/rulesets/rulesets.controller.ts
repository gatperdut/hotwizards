import { HwRuleset, HwRulesetsByIdsDto } from '@hw/shared';
import { Controller, Get, Query } from '@nestjs/common';
import { RulesetsService } from './rulesets.service.js';

@Controller('rulesets')
export class RulesetsController {
  constructor(private rulesetsService: RulesetsService) {}

  @Get('by-ids')
  public byIds(@Query() params: HwRulesetsByIdsDto): Promise<HwRuleset[]> {
    return this.rulesetsService.byIds(params.ids);
  }
}
