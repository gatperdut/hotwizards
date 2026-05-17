import { SpriteOffset } from './sprite-offset.const.js';

export const ClosedChestSpritePaths = [
  '/tiles/feature/closed_chest_s.png',
  '/tiles/feature/closed_chest_w.png',
  '/tiles/feature/closed_large_chest_s.png',
  '/tiles/feature/closed_large_chest_w.png',
] as const;

export type ClosedChestSpritePath = (typeof ClosedChestSpritePaths)[number];

export const OpenChestSpritePaths = [
  '/tiles/feature/open_chest_s.png',
  '/tiles/feature/open_chest_w.png',
  '/tiles/feature/open_large_chest_s.png',
  '/tiles/feature/open_large_chest_w.png',
] as const;

export type OpenChestSpritePath = (typeof OpenChestSpritePaths)[number];

export const ChestSpritePaths = [...ClosedChestSpritePaths, ...OpenChestSpritePaths] as const;

export type ChestSpritePath = (typeof ChestSpritePaths)[number];

export const ChestSpriteSecondaries: Record<ChestSpritePath, SpriteOffset[]> = {
  '/tiles/feature/closed_chest_s.png': [],
  '/tiles/feature/closed_chest_w.png': [],
  '/tiles/feature/closed_large_chest_s.png': [{ x: 1, y: 0 }],
  '/tiles/feature/closed_large_chest_w.png': [{ x: 0, y: -1 }],
  '/tiles/feature/open_chest_s.png': [],
  '/tiles/feature/open_chest_w.png': [],
  '/tiles/feature/open_large_chest_s.png': [{ x: 1, y: 0 }],
  '/tiles/feature/open_large_chest_w.png': [{ x: 0, y: -1 }],
} as const;
