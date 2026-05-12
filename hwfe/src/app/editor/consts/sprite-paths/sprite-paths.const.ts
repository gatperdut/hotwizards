import { SpriteOffset } from '../../types/sprite-offset.type';
import { BaseSpriteOffsets, BaseSpritePaths, BaseSpriteSizes } from './base-sprite-paths.const';
import {
  CreatureSpriteOffsets,
  CreatureSpritePaths,
  CreatureSpriteSizes,
} from './creature-sprite-paths.const';
import { DoorSpriteOffsets, DoorSpritePaths, DoorSpriteSizes } from './door-sprite-paths.const';
import {
  FeatureSpriteOffsets,
  FeatureSpritePaths,
  FeatureSpriteSizes,
} from './feature-sprite-paths.const';

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
