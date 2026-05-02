import { HwAdventureTemplate, HwAdventureTemplateSearchDto, Paginated } from '@hw/shared';
import { Controller, Get, Query } from '@nestjs/common';
import { AdventureTemplatesService } from './adventure-templates.service.js';

@Controller('adventure-templates')
export class AdventureTemplatesController {
  constructor(private adventureTemplatesService: AdventureTemplatesService) {}

  @Get()
  public search(
    @Query() params: HwAdventureTemplateSearchDto,
  ): Promise<Paginated<HwAdventureTemplate>> {
    return this.adventureTemplatesService.search(params.term, params.page, params.pageSize);
  }
}
