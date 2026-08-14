import { PrismaClient } from '@hw/prismagen/client';
import { PrismaPg } from '@hw/prismagen/adapter-pg';
import './env.js';
import { seedAdventureTemplates } from './seeds/dev/adventure-templates.seed.js';
import { seedCampaigns } from './seeds/dev/campaigns.seed.js';
import { seedUsers } from './seeds/dev/users.seed.js';

const connectionString = process.env['HWBE_DB_URL'] as string;

const adapter = new PrismaPg({ connectionString: connectionString });

const prismaClient = new PrismaClient({ adapter: adapter });

async function main(): Promise<void> {
  await seedUsers(prismaClient);

  await seedAdventureTemplates(prismaClient);

  await seedCampaigns(prismaClient);
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
