import { Direction } from '../directions/directions.const.js';
import { HwAlignment } from './alignment.const.js';

export interface HwCreature {
  id: number;
  alignment: HwAlignment;
  x: number;
  y: number;
  name: string;
  spritePath: string | null;
  direction: Direction;
  movementPoints: number;
  attackDie: number;
  defendDie: number;
  bodyPoints: number;
  mindPoints: number;
}
