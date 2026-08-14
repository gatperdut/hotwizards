import { DoorSpritePath } from '../../sprites/door-sprites.const.js';
import { HwDoorTrap } from './door-trap.interface.js';

export interface HwDoor {
  spritePath: DoorSpritePath | null;
  trap: HwDoorTrap;
  open: boolean;
}
