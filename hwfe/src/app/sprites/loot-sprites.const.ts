import { LootSpritePath, SpriteOffset } from '@hw/shared/sprites';

export const LootSpriteSizes: Record<LootSpritePath, SpriteOffset> = {
  '/tiles/loots/loot.png': { x: 20, y: 30 },
} as const;

export const LootSpriteOffsets: Record<LootSpritePath, SpriteOffset> = {
  '/tiles/loots/loot.png': { x: -13, y: -22 },
} as const;
