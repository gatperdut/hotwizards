import { CreatureSpritePath, SpriteOffset } from '@hw/shared/sprites';
import { HeroSpriteOffsets, HeroSpriteSizes } from './hero-sprites.const';
import { MonsterSpriteOffsets, MonsterSpriteSizes } from './monster-sprites.const';

export const CreatureSpriteSizes: Record<CreatureSpritePath, SpriteOffset> = {
  ...HeroSpriteSizes,
  ...MonsterSpriteSizes,
} as const;

export const CreatureSpriteOffsets: Record<CreatureSpritePath, SpriteOffset> = {
  ...HeroSpriteOffsets,
  ...MonsterSpriteOffsets,
} as const;
