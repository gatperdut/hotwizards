import { PrismaClient } from '@hw/prismagen/client';
import { HwCell } from '@hw/shared/editor';
import { InputJsonValue } from '@prisma/client/runtime/client';

export async function seedAdventureTemplates(prismaClient: PrismaClient): Promise<void> {
  const sunkenTombCells: HwCell[] = [
    {
      x: 5,
      y: 2,
      baseSpritePath: '/tiles/floor/floor_01.png',
      featureSpritePath: null,
      doorSpritePath: null,
      monster: {
        type: null,
        spritePath: null,
        direction: 'n',
      },
      traversable: true,
      spawn: true,
      secondary: null,
    },
    {
      x: 6,
      y: 2,
      baseSpritePath: '/tiles/floor/floor_02.png',
      featureSpritePath: null,
      doorSpritePath: null,
      monster: {
        type: null,
        spritePath: null,
        direction: 'n',
      },
      traversable: true,
      spawn: true,
      secondary: null,
    },
    {
      x: 5,
      y: 3,
      baseSpritePath: '/tiles/floor/floor_03.png',
      featureSpritePath: null,
      doorSpritePath: null,
      monster: {
        type: null,
        spritePath: null,
        direction: 'n',
      },
      traversable: true,
      spawn: true,
      secondary: null,
    },
    {
      x: 6,
      y: 3,
      baseSpritePath: '/tiles/floor/floor_04.png',
      featureSpritePath: '/tiles/feature/chair_w.png',
      doorSpritePath: null,
      monster: {
        type: null,
        spritePath: null,
        direction: 'n',
      },
      traversable: true,
      spawn: true,
      secondary: null,
    },
    {
      x: 6,
      y: 4,
      baseSpritePath: '/tiles/water/water_05.png',
      featureSpritePath: null,
      doorSpritePath: null,
      monster: {
        type: null,
        spritePath: null,
        direction: 'n',
      },
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
