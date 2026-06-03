import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class HwCharacterEquipItemDto {
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  itemId: string;
}
