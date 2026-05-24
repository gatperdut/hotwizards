import { DoorSpritePath } from '../sprites/door-sprites.const.js';
import { HwTrapStatus } from './trap-status.interface.js';
import { HwTrapped } from './trapped.interface.js';

export interface HwDoor extends HwTrapped, HwTrapStatus {
  spritePath: DoorSpritePath | null;
  open: boolean;
}
