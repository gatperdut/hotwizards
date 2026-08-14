import { DoorTrapSpritePath } from '../../sprites/door-trap-sprites.const.js';
import { HwTrapStatus } from './trap-status.interface.js';

export interface HwDoorTrap extends HwTrapStatus {
  spritePath: DoorTrapSpritePath | null;
}
