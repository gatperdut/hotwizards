import { HwSecondary } from '../map/secondary.interface.js';
import { BaseSpritePath } from '../sprites/base-sprites.const.js';
import { DoorSpritePath } from '../sprites/door-sprites.const.js';
import { FloorTrapSpritePath } from '../sprites/floor-trap-sprites.const.js';
import { StairsSpritePath } from '../sprites/stairs-sprites.const.js';
import { HwEditorCorners } from './editor-corners.interface.js';
import { HwEditorFeature } from './editor-feature.interface.js';
import { HwEditorMonster } from './editor-monster.interface.js';

export interface HwEditorCell {
  x: number;
  y: number;
  baseSpritePath: BaseSpritePath;
  feature: HwEditorFeature;
  doorSpritePath: DoorSpritePath | null;
  monster: HwEditorMonster;
  floorTrapSpritePath: FloorTrapSpritePath | null;
  stairsSpritePath: StairsSpritePath | null;
  corners: HwEditorCorners;
  spawn: boolean;
  secondary: HwSecondary | null;
}
