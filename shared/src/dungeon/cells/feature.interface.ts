import { FeatureSpritePath } from '../../sprites/feature-sprites.const.js';
import { HwTrapStatus } from './trap-status.interface.js';
import { HwTrapped } from './trapped.interface.js';

export interface HwFeature extends HwTrapped, HwTrapStatus {
  spritePath: FeatureSpritePath | null;
}
