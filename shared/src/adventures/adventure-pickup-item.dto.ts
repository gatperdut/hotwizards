import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class HwAdventurePickupItemDto {
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  lootItemId: string;
}
