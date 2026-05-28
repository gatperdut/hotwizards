import {
  BaseSpritePath,
  BaseSpritePaths,
  CornerSpritePath,
  CornerSpritePaths,
  CreatureSpritePath,
  CreatureSpritePaths,
  DoorSpritePath,
  DoorSpritePaths,
  FeatureSpritePath,
  FeatureSpritePaths,
  FeatureTrapSpritePath,
  FeatureTrapSpritePaths,
  FloorTrapSpritePath,
  FloorTrapSpritePaths,
  SpawnSpritePath,
  SpawnSpritePaths,
  SpriteOffset,
  SpritePath,
  StairsSpritePath,
  StairsSpritePaths,
} from '@hw/shared/sprites';
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

export const spriteZIndex = (spritePath: SpritePath): number => {
  if (BaseSpritePaths.includes(spritePath as BaseSpritePath)) {
    return 0;
  }
  if (CornerSpritePaths.includes(spritePath as CornerSpritePath)) {
    return 0;
  }
  if (FeatureSpritePaths.includes(spritePath as FeatureSpritePath)) {
    return 5;
  }
  if (FeatureTrapSpritePaths.includes(spritePath as FeatureTrapSpritePath)) {
    return 0;
  }
  if (DoorSpritePaths.includes(spritePath as DoorSpritePath)) {
    return 0;
  }
  if (CreatureSpritePaths.includes(spritePath as CreatureSpritePath)) {
    return 5;
  }
  if (FloorTrapSpritePaths.includes(spritePath as FloorTrapSpritePath)) {
    return 5;
  }
  if (StairsSpritePaths.includes(spritePath as StairsSpritePath)) {
    return 0;
  }
  if (SpawnSpritePaths.includes(spritePath as SpawnSpritePath)) {
    return 0;
  }

  return 0;
};
