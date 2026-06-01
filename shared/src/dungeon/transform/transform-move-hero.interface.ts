import { Direction } from '../../directions/directions.const.js';
import { SpriteOffset } from '../../sprites/sprite-offset.const.js';

export interface HwTransformMoveHero {
  heroId: number;
  dir: Direction;
  cell: SpriteOffset;
}
