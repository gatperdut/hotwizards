import { Controller } from '@nestjs/common';
import { RulesetsService } from './rulesets.service.js';

@Controller('rulesets')
export class RulesetsController {
  constructor(private rulesetsService: RulesetsService) {}
}
