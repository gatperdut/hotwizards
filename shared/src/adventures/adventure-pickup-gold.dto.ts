import { IsInt, IsPositive } from 'class-validator';

export class HwAdventurePickupGoldDto {
  @IsInt()
  @IsPositive()
  amount: number;
}
