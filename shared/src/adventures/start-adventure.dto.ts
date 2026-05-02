import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class HwStartAdventureDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  adventureTemplateId: number;
}
