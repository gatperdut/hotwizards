import { IsIn, IsInt, IsPositive } from 'class-validator';
import { Direction, Directions } from '../directions/directions.const.js';

export class HwAdventureMoveMonsterDto {
  @IsInt()
  @IsPositive()
  monsterId: number;

  @IsIn(Directions)
  direction: Direction;
}
