import { Transform } from 'class-transformer';
import { IsString, MaxLength } from 'class-validator';
import { HwRulesetUpsertDto } from '../rulesets/ruleset-upsert.dto.js';

export class HwCampaignUpsertDto extends HwRulesetUpsertDto {
  @IsString()
  @MaxLength(40)
  @Transform(({ value }) => value?.trim())
  name: string;
}
