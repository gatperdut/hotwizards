import { FloorTrapSpritePath } from '../../sprites/floor-trap-sprites.const.js';
import { HwTrapStatus } from './trap-status.interface.js';

export interface HwFloorTrap extends HwTrapStatus {
  spritePath: FloorTrapSpritePath | null;
}
