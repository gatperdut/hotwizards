import { SpriteOffset, SpritePath } from '@hw/shared/sprites';
import { BaseSpriteOffsets, BaseSpriteSizes } from './base-sprites.const';
import { CreatureSpriteOffsets, CreatureSpriteSizes } from './creature-sprites.const';
import { DoorSpriteOffsets, DoorSpriteSizes } from './door-sprites.const';
import { FeatureSpriteOffsets, FeatureSpriteSizes } from './feature-sprites.const';
import { FloorTrapSpriteOffsets, FloorTrapSpriteSizes } from './floor-trap-sprites.const';
import { SpawnSpriteOffsets, SpawnSpriteSizes } from './spawn-sprites.const';

export const SpriteSizes: Record<SpritePath, SpriteOffset> = {
  ...BaseSpriteSizes,
  ...FeatureSpriteSizes,
  ...DoorSpriteSizes,
  ...CreatureSpriteSizes,
  ...FloorTrapSpriteSizes,
  ...SpawnSpriteSizes,
} as const;

export const SpriteOffsets: Record<SpritePath, SpriteOffset> = {
  ...BaseSpriteOffsets,
  ...FeatureSpriteOffsets,
  ...DoorSpriteOffsets,
  ...CreatureSpriteOffsets,
  ...FloorTrapSpriteOffsets,
  ...SpawnSpriteOffsets,
} as const;
