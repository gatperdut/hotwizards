export const DoorTrapSpritePaths = ['/tiles/feature-traps/feature-trap.png'] as const;

export type DoorTrapSpritePath = (typeof DoorTrapSpritePaths)[number];
