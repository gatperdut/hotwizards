import { Controller } from '@nestjs/common';
import { CharactersService } from './characters.service.js';

@Controller('characters')
export class CharactersController {
  constructor(private charactersService: CharactersService) {}
}
