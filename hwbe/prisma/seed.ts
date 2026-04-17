import { PrismaClient } from '@hw/prismagen/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { seedCampaigns } from './seeds/campaigns.seed.js';
import { seedUsers } from './seeds/users.seed.js';

const connectionString: string = process.env['HWBE_DB_URL'] as string;

const adapter: PrismaPg = new PrismaPg({ connectionString: connectionString });

const prisma = new PrismaClient({ adapter: adapter });

async function main(): Promise<void> {
  await seedUsers(prisma);

  await seedCampaigns(prisma);
}

main()
  .then(async (): Promise<void> => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
