import { BaseSpritePath } from '../sprites/base-sprites.const.js';
import { DoorSpritePath } from '../sprites/door-sprites.const.js';
import { FloorTrapSpritePath } from '../sprites/floor-trap-sprites.const.js';
import { HwFeature } from './feature.interface.js';
import { HwMonster } from './monster.interface.js';
import { HwSecondary } from './secondary.interface.js';

export interface HwCell {
  x: number;
  y: number;
  baseSpritePath: BaseSpritePath;
  feature: HwFeature;
  doorSpritePath: DoorSpritePath | null;
  monster: HwMonster;
  floorTrapSpritePath: FloorTrapSpritePath | null;
  traversable: boolean;
  spawn: boolean;
  secondary: HwSecondary | null;
}
