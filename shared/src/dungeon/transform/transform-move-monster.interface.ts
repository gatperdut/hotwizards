import { Direction } from '../../directions/directions.const.js';
import { SpriteOffset } from '../../sprites/sprite-offset.const.js';

export interface HwTransformMoveMonster {
  monsterId: number;
  dir: Direction;
  cell: SpriteOffset;
}
