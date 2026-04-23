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
      memberships: {
        create: [
          {
            userId: josep.id,
            status: MembershipStatus.ACTIVE,
            character: { create: { name: 'Zanza', gender: 'MALE', klass: 'DWARF' } },
          },
          {
            userId: victor.id,
            status: MembershipStatus.ACTIVE,
            character: { create: { name: 'Arno', gender: 'MALE', klass: 'WIZARD' } },
          },
          {
            userId: vicent.id,
            status: MembershipStatus.PENDING,
          },
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
