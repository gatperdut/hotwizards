export const OpenDoorSpritePaths = [
  '/tiles/door/open_door_x.png',
  '/tiles/door/open_door_y.png',
] as const;

export const ClosedDoorSpritePaths = [
  '/tiles/door/closed_door_x.png',
  '/tiles/door/closed_door_y.png',
] as const;

export const DoorSpritePaths = [...OpenDoorSpritePaths, ...ClosedDoorSpritePaths] as const;

export type OpenDoorSpritePath = (typeof OpenDoorSpritePaths)[number];
export type ClosedDoorSpritePath = (typeof ClosedDoorSpritePaths)[number];
export type DoorSpritePath = (typeof DoorSpritePaths)[number];
