import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class HwCharacterPickupItemDto {
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  stashItemId: string;
}
