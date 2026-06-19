import { IsIn, IsInt, IsPositive } from 'class-validator';
import { Adjacent, Adjacents } from '../directions/adjacents/adjacents.const.js';

export class HwAdventureMoveMonsterDto {
  @IsInt()
  @IsPositive()
  monsterId: number;

  @IsIn(Adjacents)
  adjacent: Adjacent;
}
