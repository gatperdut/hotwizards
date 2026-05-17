import { PrismaClient } from '@hw/prismagen/client';
import { HwCell } from '@hw/shared/editor';
import { InputJsonValue } from '@prisma/client/runtime/client';

export async function seedAdventureTemplates(prismaClient: PrismaClient): Promise<void> {
  const sunkenTombCells: HwCell[] = [
    {
      x: 5,
      y: 2,
      baseSpritePath: '/tiles/floors/floor_01.png',
      feature: {
        spritePath: null,
        trapped: false,
      },
      doorSpritePath: null,
      monster: {
        type: null,
        spritePath: null,
        direction: 'n',
      },
      floorTrapSpritePath: null,
      traversable: true,
      spawn: true,
      secondary: null,
    },
    {
      x: 6,
      y: 2,
      baseSpritePath: '/tiles/floors/floor_02.png',
      feature: {
        spritePath: null,
        trapped: false,
      },
      doorSpritePath: null,
      monster: {
        type: null,
        spritePath: null,
        direction: 'n',
      },
      floorTrapSpritePath: null,
      traversable: true,
      spawn: true,
      secondary: null,
    },
    {
      x: 5,
      y: 3,
      baseSpritePath: '/tiles/floors/floor_03.png',
      feature: {
        spritePath: null,
        trapped: false,
      },
      doorSpritePath: null,
      monster: {
        type: null,
        spritePath: null,
        direction: 'n',
      },
      floorTrapSpritePath: null,
      traversable: true,
      spawn: true,
      secondary: null,
    },
    {
      x: 6,
      y: 3,
      baseSpritePath: '/tiles/floors/floor_04.png',
      feature: {
        spritePath: '/tiles/features/chair_w.png',
        trapped: false,
      },
      doorSpritePath: null,
      monster: {
        type: null,
        spritePath: null,
        direction: 'n',
      },
      floorTrapSpritePath: null,
      traversable: true,
      spawn: true,
      secondary: null,
    },
    {
      x: 6,
      y: 4,
      feature: {
        spritePath: null,
        trapped: false,
      },
      baseSpritePath: '/tiles/waters/water_05.png',
      doorSpritePath: null,
      monster: {
        type: null,
        spritePath: null,
        direction: 'n',
      },
      floorTrapSpritePath: null,
      traversable: true,
      spawn: false,
      secondary: null,
    },
  ];

  await prismaClient.adventureTemplate.createMany({
    data: [
      {
        name: 'The Sunken Tomb',
        info: 'Explore the Sunken Tomb!',
        dungeon: { cells: sunkenTombCells as unknown as InputJsonValue },
      },
      { name: 'Raid on Blackmoor Keep', info: 'Raid the Blackmoor Keep!', dungeon: { cells: [] } },
    ],
  });
}
