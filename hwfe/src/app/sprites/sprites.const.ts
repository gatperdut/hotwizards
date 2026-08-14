import {
  BaseSpritePath,
  BaseSpritePaths,
  CornerSpritePath,
  CornerSpritePaths,
  CreatureSpritePath,
  CreatureSpritePaths,
  DoorSpritePath,
  DoorSpritePaths,
  DoorTrapSpritePath,
  DoorTrapSpritePaths,
  FeatureSpritePath,
  FeatureSpritePaths,
  FeatureTrapSpritePath,
  FeatureTrapSpritePaths,
  FloorTrapSpritePath,
  FloorTrapSpritePaths,
  LootSpritePath,
  LootSpritePaths,
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
import { DoorTrapSpriteOffsets, DoorTrapSpriteSizes } from './door-trap-sprites.const';
import { FeatureSpriteOffsets, FeatureSpriteSizes } from './feature-sprites.const';
import { FeatureTrapSpriteOffsets, FeatureTrapSpriteSizes } from './feature-trap-sprites.const';
import { FloorTrapSpriteOffsets, FloorTrapSpriteSizes } from './floor-trap-sprites.const';
import { LootSpriteOffsets, LootSpriteSizes } from './loot-sprites.const';
import { SpawnSpriteOffsets, SpawnSpriteSizes } from './spawn-sprites.const';
import { StairsSpriteOffsets, StairsSpriteSizes } from './stairs-sprites.const';

export const SpriteSizes: Record<SpritePath, SpriteOffset> = {
  ...BaseSpriteSizes,
  ...CornerSpriteSizes,
  ...FloorTrapSpriteSizes,
  ...FeatureTrapSpriteSizes,
  ...DoorTrapSpriteSizes,
  ...FeatureSpriteSizes,
  ...DoorSpriteSizes,
  ...CreatureSpriteSizes,
  ...StairsSpriteSizes,
  ...SpawnSpriteSizes,
  ...LootSpriteSizes,
} as const;

export const SpriteOffsets: Record<SpritePath, SpriteOffset> = {
  ...BaseSpriteOffsets,
  ...CornerSpriteOffsets,
  ...FloorTrapSpriteOffsets,
  ...FeatureTrapSpriteOffsets,
  ...DoorTrapSpriteOffsets,
  ...FeatureSpriteOffsets,
  ...DoorSpriteOffsets,
  ...CreatureSpriteOffsets,
  ...StairsSpriteOffsets,
  ...SpawnSpriteOffsets,
  ...LootSpriteOffsets,
} as const;

export const spriteZIndex = (spritePath: SpritePath): number => {
  if (BaseSpritePaths.includes(spritePath as BaseSpritePath)) {
    return 0;
  }
  if (CornerSpritePaths.includes(spritePath as CornerSpritePath)) {
    return 0;
  }
  if (FloorTrapSpritePaths.includes(spritePath as FloorTrapSpritePath)) {
    return 5;
  }
  if (FeatureTrapSpritePaths.includes(spritePath as FeatureTrapSpritePath)) {
    return 6;
  }
  if (DoorTrapSpritePaths.includes(spritePath as DoorTrapSpritePath)) {
    return 6;
  }
  if (FeatureSpritePaths.includes(spritePath as FeatureSpritePath)) {
    return 5;
  }
  if (DoorSpritePaths.includes(spritePath as DoorSpritePath)) {
    return 5;
  }
  if (CreatureSpritePaths.includes(spritePath as CreatureSpritePath)) {
    return 5;
  }
  if (StairsSpritePaths.includes(spritePath as StairsSpritePath)) {
    return 0;
  }
  if (SpawnSpritePaths.includes(spritePath as SpawnSpritePath)) {
    return 0;
  }
  if (LootSpritePaths.includes(spritePath as LootSpritePath)) {
    return 1;
  }

  return 0;
};
