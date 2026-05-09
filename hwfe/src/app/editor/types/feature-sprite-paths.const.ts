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
