import { FeatureSpritePath } from '../../sprites/feature-sprites.const.js';
import { HwFeatureTrap } from './feature-trap.interface.js';

export interface HwFeature {
  spritePath: FeatureSpritePath | null;
  trap: HwFeatureTrap;
}
