import { MembershipStatus, PrismaClient } from '@hw/prismagen/client';

export async function seedCampaigns(prismaClient: PrismaClient): Promise<void> {
  const carlos = await prismaClient.user.findUnique({ where: { handle: 'Carlos' } });
  const josep = await prismaClient.user.findUnique({ where: { handle: 'Josep' } });
  const victor = await prismaClient.user.findUnique({ where: { handle: 'Victor' } });
  const vicent = await prismaClient.user.findUnique({ where: { handle: 'Vicent' } });

  if (!carlos || !josep || !victor || !vicent) {
    throw new Error('Required users for campaign seeding not found.');
  }

  await prismaClient.campaign.create({
    data: {
      name: 'The Shadow over Valencia',
      masterId: carlos.id,
      members: {
        create: [
          { userId: josep.id, status: MembershipStatus.ACCEPTED },
          { userId: victor.id, status: MembershipStatus.ACCEPTED },
          { userId: vicent.id, status: MembershipStatus.ACCEPTED },
        ],
      },
    },
  });

  await prismaClient.campaign.create({
    data: {
      name: "Josep's Solo Adventure",
      masterId: josep.id,
    },
  });
}
