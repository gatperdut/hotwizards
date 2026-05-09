import { PrismaClient } from '@hw/prismagen/client';
import { HwCell } from '@hw/shared';
import { InputJsonValue } from '@prisma/client/runtime/client';

export async function seedAdventureTemplates(prismaClient: PrismaClient): Promise<void> {
  const sunkenTombCells: HwCell[] = [
    {
      x: 5,
      y: 2,
      baseSpritePath: '/tiles/ground/ground_01.png',
      featureSpritePath: undefined,
      traversable: true,
    },
    {
      x: 6,
      y: 2,
      baseSpritePath: '/tiles/ground/ground_02.png',
      featureSpritePath: undefined,
      traversable: true,
    },
    {
      x: 5,
      y: 3,
      baseSpritePath: '/tiles/ground/ground_03.png',
      featureSpritePath: undefined,
      traversable: true,
    },
    {
      x: 6,
      y: 3,
      baseSpritePath: '/tiles/ground/ground_04.png',
      featureSpritePath: undefined,
      traversable: true,
    },
    {
      x: 6,
      y: 4,
      baseSpritePath: '/tiles/water/water_05.png',
      featureSpritePath: undefined,
      traversable: true,
    },
  ];

  await prismaClient.adventureTemplate.createMany({
    data: [
      { name: 'The Sunken Tomb', dungeon: { cells: sunkenTombCells as unknown as InputJsonValue } },
      { name: 'Raid on Blackmoor Keep', dungeon: { cells: [] } },
    ],
  });
}
