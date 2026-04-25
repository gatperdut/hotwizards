import { Movement } from '@hw/prismagen/browser';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum } from 'class-validator';

export class HwRulesetEditDto {
  @IsBoolean()
  @Type(() => Boolean)
  aoo: boolean;

  @IsEnum(Movement)
  movement: Movement;
}
