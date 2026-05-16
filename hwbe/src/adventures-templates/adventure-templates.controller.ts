import {
  HwAdventureTemplate,
  HwAdventureTemplateEditDto,
  HwAdventureTemplateSearchDto,
} from '@hw/shared/adventure-templates';
import { Paginated } from '@hw/shared/pagination';
import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
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

  @Patch()
  @UseGuards(AdminGuard)
  public create(@Body() body: HwAdventureTemplateEditDto): Promise<number> {
    return this.adventureTemplatesService.create(body.name, body.info, body.dungeon);
  }

  @Patch(':adventureTemplateId')
  @UseGuards(AdminGuard, SetAdventureTemplateGuard)
  public update(
    @CurrentAdventureTemplate() adventureTemplate: HwAdventureTemplate,
    @Body() body: HwAdventureTemplateEditDto,
  ): Promise<number> {
    return this.adventureTemplatesService.update(
      adventureTemplate,
      body.name,
      body.info,
      body.dungeon,
    );
  }
}
