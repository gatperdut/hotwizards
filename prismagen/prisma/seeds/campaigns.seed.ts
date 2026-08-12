import { MembershipStatus, PrismaClient } from '@hw/prismagen/client';
import { HwBackpack, HwInventory } from '@hw/shared/inventory';
import { InputJsonObject } from '@prisma/client/runtime/client';

export async function seedCampaigns(prismaClient: PrismaClient): Promise<void> {
  const carlos = await prismaClient.user.findUnique({ where: { handle: 'Carlos' } });
  const josep = await prismaClient.user.findUnique({ where: { handle: 'Josep' } });
  const victor = await prismaClient.user.findUnique({ where: { handle: 'Victor' } });
  const vicent = await prismaClient.user.findUnique({ where: { handle: 'Vicent' } });

  if (!carlos || !josep || !victor || !vicent) {
    throw new Error('Required users for campaign seeding not found.');
  }

  const zanzaInventory: HwInventory = {
    gear: {
      arms: null,
      body: null,
      cloak: null,
      feet: null,
      head: null,
      onehanded: { id: crypto.randomUUID(), name: 'shortsword' },
      shield: null,
      twohanded: null,
    },
    backpack: {
      gold: 3,
      items: [
        {
          id: crypto.randomUUID(),
          name: 'toolkit',
        },
      ],
    },
  };

  const arnoInventory: HwInventory = {
    gear: {
      arms: null,
      body: null,
      cloak: null,
      feet: null,
      head: null,
      onehanded: { id: crypto.randomUUID(), name: 'dagger' },
      shield: null,
      twohanded: null,
    },
    backpack: { gold: 0, items: [{ id: crypto.randomUUID(), name: 'shield' }] },
  };

  const lefaInventory: HwInventory = {
    gear: {
      arms: null,
      body: null,
      cloak: null,
      feet: null,
      head: null,
      onehanded: { id: crypto.randomUUID(), name: 'shortsword' },
      shield: null,
      twohanded: null,
    },
    backpack: { gold: 10, items: [] },
  };

  const stash = {
    gold: 2,
    items: [{ id: crypto.randomUUID(), name: 'chainmail' }],
  } satisfies HwBackpack;

  await prismaClient.campaign.create({
    data: {
      name: 'The Shadow over Valencia',
      masterId: carlos.id,
      memberships: {
        create: [
          {
            userId: josep.id,
            status: MembershipStatus.ACTIVE,
            character: {
              create: {
                name: 'Zanza',
                gender: 'MALE',
                klass: 'DWARF',
                inventory: zanzaInventory as unknown as InputJsonObject,
              },
            },
          },
          {
            userId: victor.id,
            status: MembershipStatus.ACTIVE,
            character: {
              create: {
                name: 'Arno',
                gender: 'MALE',
                klass: 'WIZARD',
                inventory: arnoInventory as unknown as InputJsonObject,
              },
            },
          },
          {
            userId: vicent.id,
            status: MembershipStatus.ACTIVE,
            character: {
              create: {
                name: 'Lefa',
                gender: 'FEMALE',
                klass: 'ELF',
                inventory: lefaInventory as unknown as InputJsonObject,
              },
            },
          },
        ],
      },
      ruleset: {
        create: {
          aoo: true,
          movement: 'BALANCED',
        },
      },
      stash: stash,
    },
  });

  await prismaClient.campaign.create({
    data: {
      name: "Josep's Solo Adventure",
      masterId: josep.id,
      ruleset: {
        create: {
          aoo: false,
          movement: 'REGULAR',
        },
      },
      stash: {
        gold: 1000,
        items: [],
      },
    },
  });
}
