import { SpriteOffset, SpritePath } from '@hw/shared/sprites';
import { BaseSpriteOffsets, BaseSpriteSizes } from './base-sprites.const';
import { CornerSpriteOffsets, CornerSpriteSizes } from './corner-sprites.const';
import { CreatureSpriteOffsets, CreatureSpriteSizes } from './creature-sprites.const';
import { DoorSpriteOffsets, DoorSpriteSizes } from './door-sprites.const';
import { FeatureSpriteOffsets, FeatureSpriteSizes } from './feature-sprites.const';
import { FeatureTrapSpriteOffsets, FeatureTrapSpriteSizes } from './feature-trap-sprites.const';
import { FloorTrapSpriteOffsets, FloorTrapSpriteSizes } from './floor-trap-sprites.const';
import { SpawnSpriteOffsets, SpawnSpriteSizes } from './spawn-sprites.const';
import { StairsSpriteOffsets, StairsSpriteSizes } from './stairs-sprites.const';

export const SpriteSizes: Record<SpritePath, SpriteOffset> = {
  ...BaseSpriteSizes,
  ...CornerSpriteSizes,
  ...FeatureSpriteSizes,
  ...FeatureTrapSpriteSizes,
  ...DoorSpriteSizes,
  ...CreatureSpriteSizes,
  ...FloorTrapSpriteSizes,
  ...StairsSpriteSizes,
  ...SpawnSpriteSizes,
} as const;

export const SpriteOffsets: Record<SpritePath, SpriteOffset> = {
  ...BaseSpriteOffsets,
  ...CornerSpriteOffsets,
  ...FeatureSpriteOffsets,
  ...FeatureTrapSpriteOffsets,
  ...DoorSpriteOffsets,
  ...CreatureSpriteOffsets,
  ...FloorTrapSpriteOffsets,
  ...StairsSpriteOffsets,
  ...SpawnSpriteOffsets,
} as const;
