import { PrismaClient } from '@hw/prismagen/client';
import { PrismaPg } from '@prisma/adapter-pg';
import './env.js';
import { seedUsers } from './seeds/prod/users.seed.js';

const connectionString: string = process.env['HWBE_DB_URL'] as string;

const adapter = new PrismaPg({ connectionString: connectionString });

const prismaClient = new PrismaClient({ adapter: adapter });

async function main(): Promise<void> {
  await seedUsers(prismaClient);
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
