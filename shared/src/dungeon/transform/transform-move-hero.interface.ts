import { Direction } from '../../directions/directions.const.js';
import { SpriteOffset } from '../../sprites/sprite-offset.const.js';
import { CellLosUpdate } from '../cells/cell-los-update.const.js';

export interface HwTransformMoveHero extends Partial<CellLosUpdate> {
  heroId: number;
  dir: Direction;
  cell: SpriteOffset;
}
