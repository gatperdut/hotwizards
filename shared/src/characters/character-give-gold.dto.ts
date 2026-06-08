import { IsInt, IsPositive } from 'class-validator';

export class HwCharacterGiveGoldDto {
  @IsInt()
  @IsPositive()
  amount: number;
}
