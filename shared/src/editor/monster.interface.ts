import { Direction } from '../directions/directions.const.js';

export interface HwMonster {
  type: string | null;
  spritePath: string | null;
  direction: Direction;
}
