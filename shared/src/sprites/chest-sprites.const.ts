import { SpriteOffset } from './sprite-offset.const.js';

export const ClosedChestSpritePaths = [
  '/tiles/features/closed_chest_s.png',
  '/tiles/features/closed_chest_w.png',
  '/tiles/features/closed_large_chest_s.png',
  '/tiles/features/closed_large_chest_w.png',
] as const;

export type ClosedChestSpritePath = (typeof ClosedChestSpritePaths)[number];

export const OpenChestSpritePaths = [
  '/tiles/features/open_chest_s.png',
  '/tiles/features/open_chest_w.png',
  '/tiles/features/open_large_chest_s.png',
  '/tiles/features/open_large_chest_w.png',
] as const;

export type OpenChestSpritePath = (typeof OpenChestSpritePaths)[number];

export const ChestSpritePaths = [...ClosedChestSpritePaths, ...OpenChestSpritePaths] as const;

export type ChestSpritePath = (typeof ChestSpritePaths)[number];

export const ChestSpriteSecondaries: Record<ChestSpritePath, SpriteOffset[]> = {
  '/tiles/features/closed_chest_s.png': [],
  '/tiles/features/closed_chest_w.png': [],
  '/tiles/features/closed_large_chest_s.png': [{ x: 1, y: 0 }],
  '/tiles/features/closed_large_chest_w.png': [{ x: 0, y: -1 }],
  '/tiles/features/open_chest_s.png': [],
  '/tiles/features/open_chest_w.png': [],
  '/tiles/features/open_large_chest_s.png': [{ x: 1, y: 0 }],
  '/tiles/features/open_large_chest_w.png': [{ x: 0, y: -1 }],
} as const;
