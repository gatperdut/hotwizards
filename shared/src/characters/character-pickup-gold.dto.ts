import { IsInt, IsPositive } from 'class-validator';

export class HwCharacterPickupGoldDto {
  @IsInt()
  @IsPositive()
  amount: number;
}
