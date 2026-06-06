import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class HwCharacterDropItemDto {
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  backpackItemId: string;
}
