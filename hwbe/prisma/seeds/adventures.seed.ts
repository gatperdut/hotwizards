import { PrismaClient } from '@hw/prismagen/client';
import { HwDungeon } from '@hw/shared/dungeon';
import { InputJsonObject } from '@prisma/client/runtime/client';

export async function seedAdventures(prismaClient: PrismaClient): Promise<void> {
  const adventureTemplate = await prismaClient.adventureTemplate.findFirst({
    where: { name: 'Raid on Blackmoor Keep' },
  });
  const campaign = await prismaClient.campaign.findFirst({
    where: { name: 'The Shadow over Valencia' },
  });

  if (!adventureTemplate || !campaign) {
    throw new Error('Required template or campaign for adventure seeding not found.');
  }

  const dungeon: HwDungeon = {
    cells: [],
    monsters: [],
    heroes: [],
  };

  await prismaClient.adventure.create({
    data: {
      templateId: adventureTemplate.id,
      campaignId: campaign.id,
      dungeon: dungeon as unknown as InputJsonObject,
    },
  });
}
