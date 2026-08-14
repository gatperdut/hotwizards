import { FeatureTrapSpritePath } from '../../sprites/feature-trap-sprites.const.js';
import { HwTrapStatus } from './trap-status.interface.js';

export interface HwFeatureTrap extends HwTrapStatus {
  spritePath: FeatureTrapSpritePath | null;
}
