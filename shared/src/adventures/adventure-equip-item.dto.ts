import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class HwAdventureEquipItemDto {
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  backpackItemId: string;
}
