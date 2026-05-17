import { BaseSpritePaths, SpriteOffset } from '@hw/shared/sprites';
import { BaseSpriteOffsets, BaseSpriteSizes } from './base-sprite-paths.const';
import {
  CreatureSpriteOffsets,
  CreatureSpritePaths,
  CreatureSpriteSizes,
} from './creature-sprite-paths.const';
import { DoorSpriteOffsets, DoorSpritePaths, DoorSpriteSizes } from './door-sprite-paths.const';
import { FeatureSpriteOffsets, FeatureSpriteSizes } from './feature-sprite-paths.const';

import { FeatureSpritePaths } from '@hw/shared/sprites';

export const SpritePaths = [
  ...BaseSpritePaths,
  ...FeatureSpritePaths,
  ...DoorSpritePaths,
  ...CreatureSpritePaths,
] as const;

export type SpritePath = (typeof SpritePaths)[number];

export const SpriteSizes: Record<SpritePath, SpriteOffset> = {
  ...BaseSpriteSizes,
  ...FeatureSpriteSizes,
  ...DoorSpriteSizes,
  ...CreatureSpriteSizes,
} as const;

export const SpriteOffsets: Record<SpritePath, SpriteOffset> = {
  ...BaseSpriteOffsets,
  ...FeatureSpriteOffsets,
  ...DoorSpriteOffsets,
  ...CreatureSpriteOffsets,
} as const;
