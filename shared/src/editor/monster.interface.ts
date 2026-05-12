import { Direction } from '../direction/direction.const.js';

export interface HwMonster {
  type: string | null;
  spritePath: string | null;
  direction: Direction;
}
