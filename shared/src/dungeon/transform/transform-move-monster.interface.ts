import { Adjacent } from '../../directions/adjacents/adjacents.const.js';
import { SpriteOffset } from '../../sprites/sprite-offset.const.js';

export interface HwTransformMoveMonster {
  monsterId: number;
  adj: Adjacent;
  cell: SpriteOffset;
}
