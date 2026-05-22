import { FeatureSpritePath } from '../sprites/feature-sprites.const.js';
import { HwTrapped } from './trapped.interface.js';

export interface HwFeature extends HwTrapped {
  spritePath: FeatureSpritePath | null;
}
