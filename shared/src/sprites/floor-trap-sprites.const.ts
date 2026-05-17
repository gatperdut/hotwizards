export const FloorTrapSpritePaths = [
  '/tiles/traps/pit.png',
  '/tiles/traps/spikes_1.png',
  '/tiles/traps/spikes_2.png',
  '/tiles/traps/spikes_3.png',
  '/tiles/traps/boulder.png',
] as const;

export type FloorTrapSpritePath = (typeof FloorTrapSpritePaths)[number];
