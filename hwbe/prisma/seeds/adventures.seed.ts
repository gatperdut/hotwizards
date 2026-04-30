import { PrismaClient } from '@hw/prismagen/client';

export async function seedAdventures(prismaClient: PrismaClient): Promise<void> {
  const template = await prismaClient.adventureTemplate.findFirst({
    where: { name: 'Raid on Blackmoor Keep' },
  });
  const campaign = await prismaClient.campaign.findFirst({
    where: { name: 'The Shadow over Valencia' },
  });

  if (!template || !campaign) {
    throw new Error('Required template or campaign for adventure seeding not found.');
  }

  await prismaClient.adventure.create({
    data: {
      name: 'Raid on Blackmoor Keep',
      templateId: template.id,
      campaignId: campaign.id,
    },
  });
}
