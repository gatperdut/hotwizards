import { HwCharacter, HwCharactersByIdsDto } from '@hw/shared';
import { Controller, Get, Query } from '@nestjs/common';
import { CharactersService } from './characters.service.js';

@Controller('characters')
export class CharactersController {
  constructor(private charactersService: CharactersService) {}

  @Get('by-ids')
  public byIds(@Query() params: HwCharactersByIdsDto): Promise<HwCharacter[]> {
    return this.charactersService.byIds(params.ids);
  }
}
