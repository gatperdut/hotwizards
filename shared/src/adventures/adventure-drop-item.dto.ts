import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class HwAdventureDropItemDto {
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  backpackItemId: string;
}
