export const OpenDoorSpritePaths = [
  '/tiles/doors/open_door_x.png',
  '/tiles/doors/open_door_y.png',
] as const;

export const ClosedDoorSpritePaths = [
  '/tiles/doors/closed_door_x.png',
  '/tiles/doors/closed_door_y.png',
] as const;

export const DoorSpritePaths = [...OpenDoorSpritePaths, ...ClosedDoorSpritePaths] as const;

export type OpenDoorSpritePath = (typeof OpenDoorSpritePaths)[number];
export type ClosedDoorSpritePath = (typeof ClosedDoorSpritePaths)[number];
export type DoorSpritePath = (typeof DoorSpritePaths)[number];
