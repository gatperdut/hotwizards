import { BaseSpritePath } from '../../sprites/base-sprites.const.js';
import { StairsSpritePath } from '../../sprites/stairs-sprites.const.js';
import { HwCorners } from './corners.interface.js';
import { HwDoor } from './door.interface.js';
import { HwFeature } from './feature.interface.js';
import { HwFloorTrap } from './floor-trap.interface.js';
import { HwSecondary } from './secondary.interface.js';

export interface HwCell {
  x: number;
  y: number;
  creatureId: number | null;
  baseSpritePath: BaseSpritePath;
  feature: HwFeature;
  door: HwDoor | null;
  floorTrap: HwFloorTrap;
  stairsSpritePath: StairsSpritePath | null;
  corners: HwCorners;
  secondary: HwSecondary | null;
  visibility: number;
}
