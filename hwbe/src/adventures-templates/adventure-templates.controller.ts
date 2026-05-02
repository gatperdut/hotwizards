import { HwAdventureTemplateSearchDto, Paginated } from '@hw/shared';
import { Controller, Get, Query } from '@nestjs/common';
import { HwAdventureTemplate } from '../../../shared/dist/shared/src/adventure-templates/adventure-template.interface.js';
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
