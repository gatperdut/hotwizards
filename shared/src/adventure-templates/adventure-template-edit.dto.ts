import { Transform } from 'class-transformer';
import { IsObject, IsString, MaxLength } from 'class-validator';

export class HwAdventureTemplateEditDto {
  @IsString()
  @MaxLength(40)
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  info: string;

  @IsObject()
  dungeon: object;
}
