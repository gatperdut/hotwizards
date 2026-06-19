import { IsIn } from 'class-validator';
import { Adjacent, Adjacents } from '../directions/adjacents/adjacents.const.js';

export class HwAdventureMoveHeroDto {
  @IsIn(Adjacents)
  adjacent: Adjacent;
}
