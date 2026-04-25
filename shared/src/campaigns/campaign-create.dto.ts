import { Transform } from 'class-transformer';
import { IsString, MaxLength } from 'class-validator';
import { HwRulesetEditDto } from '../rulesets/ruleset-edit.dto.js';

export class HwCampaignCreateDto extends HwRulesetEditDto {
  @IsString()
  @MaxLength(40)
  @Transform(({ value }) => value?.trim())
  name: string;
}
