import { DoorSpritePath } from '../sprites/door-sprites.const.js';
import { HwEditorTrapped } from './editor-trapped.interface.js';

export interface HwEditorDoor extends HwEditorTrapped {
  spritePath: DoorSpritePath | null;
}
