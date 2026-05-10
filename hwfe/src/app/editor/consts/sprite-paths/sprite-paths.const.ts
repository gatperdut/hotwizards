import { SpriteOffset } from '../../types/sprite-offset.type';
import { BaseSpriteOffsets, BaseSpritePaths, BaseSpriteSizes } from './base-sprite-paths.const';
import { DoorSpriteOffsets, DoorSpritePaths, DoorSpriteSizes } from './door-sprite-paths.const';
import {
  FeatureSpriteOffsets,
  FeatureSpritePaths,
  FeatureSpriteSizes,
} from './feature-sprite-paths.const';

export const SpritePaths = [...BaseSpritePaths, ...FeatureSpritePaths, ...DoorSpritePaths] as const;

export type SpritePath = (typeof SpritePaths)[number];

export const SpriteSizes: Record<SpritePath, SpriteOffset> = {
  ...BaseSpriteSizes,
  ...FeatureSpriteSizes,
  ...DoorSpriteSizes,
};

export const SpriteOffsets: Record<SpritePath, SpriteOffset> = {
  ...BaseSpriteOffsets,
  ...FeatureSpriteOffsets,
  ...DoorSpriteOffsets,
};
