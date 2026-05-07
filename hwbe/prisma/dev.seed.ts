import { PrismaClient } from '@hw/prismagen/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { seedAdventureTemplates } from './seeds/adventure-templates.seed.js';
import { seedAdventures } from './seeds/adventures.seed.js';
import { seedCampaigns } from './seeds/campaigns.seed.js';
import { seedDevUsers } from './seeds/dev-users.seed.js';

const connectionString: string = process.env['HWBE_DB_URL'] as string;

const adapter: PrismaPg = new PrismaPg({ connectionString: connectionString });

const prismaClient = new PrismaClient({ adapter: adapter });

async function main(): Promise<void> {
  await seedDevUsers(prismaClient);

  await seedAdventureTemplates(prismaClient);

  await seedCampaigns(prismaClient);

  await seedAdventures(prismaClient);
}

main()
  .then(async (): Promise<void> => {
    await prismaClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);

    await prismaClient.$disconnect();

    process.exit(1);
  });
