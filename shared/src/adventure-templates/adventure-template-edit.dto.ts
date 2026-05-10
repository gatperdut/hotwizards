import { Transform } from 'class-transformer';
import { IsObject, IsString } from 'class-validator';

export class HwAdventureTemplateEditDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsObject()
  dungeon: object;
}
