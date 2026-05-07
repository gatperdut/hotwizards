import { HwAdventureTemplate, HwAdventureTemplateSearchDto, Paginated } from '@hw/shared';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../users/guards/admin.guard.js';
import { AdventureTemplatesService } from './adventure-templates.service.js';
import { CurrentAdventureTemplate } from './decorators/current-adventure-template.decorator.js';
import { SetAdventureTemplateGuard } from './guards/set-adventure-template.guard.js';

@Controller('adventure-templates')
export class AdventureTemplatesController {
  constructor(private adventureTemplatesService: AdventureTemplatesService) {}

  @Get()
  public search(
    @Query() params: HwAdventureTemplateSearchDto,
  ): Promise<Paginated<HwAdventureTemplate>> {
    return this.adventureTemplatesService.search(params.term, params.page, params.pageSize);
  }

  @Get(':adventureTemplateId')
  @UseGuards(AdminGuard, SetAdventureTemplateGuard)
  public get(
    @CurrentAdventureTemplate() adventureTemplate: HwAdventureTemplate,
  ): HwAdventureTemplate {
    return adventureTemplate;
  }
}
