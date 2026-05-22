import { FeatureSpritePath } from '@hw/shared/sprites';
import { HwTrapped } from './trapped.interface.js';

export interface HwFeature extends HwTrapped {
  spritePath: FeatureSpritePath | null;
}
