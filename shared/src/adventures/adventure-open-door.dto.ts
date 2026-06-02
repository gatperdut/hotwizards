import { IsIn } from 'class-validator';
import { Direction, Directions } from '../directions/directions.const.js';

export class HwAdventureOpenDoorDto {
  @IsIn(Directions)
  direction: Direction;
}
