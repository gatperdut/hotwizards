import { IsIn } from 'class-validator';
import { Adjacent, Adjacents } from '../directions/adjacents/adjacents.const.js';

export class HwAdventureOpenDoorDto {
  @IsIn(Adjacents)
  adjacent: Adjacent;
}
