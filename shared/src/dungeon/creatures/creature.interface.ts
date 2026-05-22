import { Direction } from '../../directions/directions.const.js';
import { CreatureSpritePath } from '../../sprites/creature-sprites.const.js';
import { HwAlignment } from '../alignment.const.js';

export interface HwCreature {
  id: number;
  alignment: HwAlignment;
  x: number;
  y: number;
  name: string;
  spritePath: CreatureSpritePath;
  direction: Direction;
  movementPoints: number;
  attackDie: number;
  defendDie: number;
  bodyPoints: number;
  mindPoints: number;
}
