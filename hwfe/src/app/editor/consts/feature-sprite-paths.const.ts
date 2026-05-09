import { SpriteOffset } from '../types/sprite-offset.type';

export const FeatureSpritePaths = [
  '/tiles/feature/barrel.png',
  '/tiles/feature/chair_e.png',
  '/tiles/feature/chair_n.png',
  '/tiles/feature/chair_s.png',
  '/tiles/feature/chair_w.png',
  '/tiles/feature/fire_shrine.png',
  '/tiles/feature/plinth.png',
  '/tiles/feature/throne_e.png',
  '/tiles/feature/throne_n.png',
  '/tiles/feature/throne_s.png',
  '/tiles/feature/throne_w.png',
  '/tiles/feature/tombstone_x.png',
  '/tiles/feature/tombstone_y.png',
  '/tiles/feature/vase.png',
  '/tiles/feature/water_shrine.png',
  '/tiles/feature/well.png',
] as const;

export type FeatureSpritePath = (typeof FeatureSpritePaths)[number];

export const FeatureSpriteOffsets: Record<FeatureSpritePath, SpriteOffset> = {
  '/tiles/feature/barrel.png': { x: 0, y: -32 },
  '/tiles/feature/chair_e.png': { x: -1, y: -30 },
  '/tiles/feature/chair_n.png': { x: 0, y: -30 },
  '/tiles/feature/chair_s.png': { x: 0, y: -30 },
  '/tiles/feature/chair_w.png': { x: 0, y: -32 },
  '/tiles/feature/fire_shrine.png': { x: 0, y: -37 },
  '/tiles/feature/plinth.png': { x: 0, y: -30 },
  '/tiles/feature/throne_e.png': { x: 0, y: -31 },
  '/tiles/feature/throne_n.png': { x: 1, y: -32 },
  '/tiles/feature/throne_s.png': { x: -1, y: -33 },
  '/tiles/feature/throne_w.png': { x: 0, y: -31 },
  '/tiles/feature/tombstone_x.png': { x: 0, y: -30 },
  '/tiles/feature/tombstone_y.png': { x: 0, y: -30 },
  '/tiles/feature/vase.png': { x: 0, y: -34 },
  '/tiles/feature/water_shrine.png': { x: 1, y: -34 },
  '/tiles/feature/well.png': { x: -1, y: -32 },
};
