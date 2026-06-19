import { Adjacent } from '../../directions/adjacents/adjacents.const.js';
import { SpriteOffset } from '../../sprites/sprite-offset.const.js';

export interface HwTransformMoveHero {
  heroId: number;
  adj: Adjacent;
  cell: SpriteOffset;
}
