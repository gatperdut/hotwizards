import { Movement } from '@hw/prismagen/client';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum } from 'class-validator';

export class HwRulesetUpsertDto {
  @IsBoolean()
  @Type(() => Boolean)
  aoo: boolean;

  @IsEnum(Movement)
  movement: Movement;
}
