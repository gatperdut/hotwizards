import { Transform } from 'class-transformer';
import { IsObject, IsString, MaxLength } from 'class-validator';
import { HwEditorDungeon } from '../editor/editor-dungeon.interface.js';

export class HwAdventureTemplateEditDto {
  @IsString()
  @MaxLength(40)
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  info: string;

  @IsObject()
  dungeon: HwEditorDungeon;
}
