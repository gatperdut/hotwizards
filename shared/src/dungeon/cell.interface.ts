import { BaseSpritePath } from '../sprites/base-sprites.const.js';
import { DoorSpritePath } from '../sprites/door-sprites.const.js';
import { StairsSpritePath } from '../sprites/stairs-sprites.const.js';
import { HwCorners } from './corners.interface.js';
import { HwFeature } from './feature.interface.js';
import { HwFloorTrap } from './floor-trap.interface.js';

export interface HwCell {
  x: number;
  y: number;
  creatureId: number | null;
  baseSpritePath: BaseSpritePath;
  feature: HwFeature;
  doorSpritePath: DoorSpritePath | null;
  floorTrap: HwFloorTrap;
  stairsSpritePath: StairsSpritePath | null;
  corners: HwCorners;
}
