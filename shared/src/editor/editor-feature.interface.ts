import { FeatureSpritePath } from '../sprites/feature-sprites.const.js';
import { HwEditorTrapped } from './editor-trapped.interface.js';

export interface HwEditorFeature extends HwEditorTrapped {
  spritePath: FeatureSpritePath | null;
}
