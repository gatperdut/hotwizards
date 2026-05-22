import { BaseSpritePath } from '../sprites/base-sprites.const.js';
import { HwFeature } from './feature.interface.js';

export interface HwCell {
  x: number;
  y: number;
  creatureId: number | null;
  baseSpritePath: BaseSpritePath;
  feature: HwFeature;
}
