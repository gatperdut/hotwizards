import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';
import { HwRulesetEditDto } from '../rulesets/ruleset-edit.dto.js';

export class HwCampaignEditDto extends HwRulesetEditDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  id?: number;

  @IsString()
  @MaxLength(40)
  @Transform(({ value }) => value?.trim())
  name: string;
}
