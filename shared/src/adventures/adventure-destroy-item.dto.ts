import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class HwAdventureDestroyItemDto {
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  backpackItemId: string;
}
