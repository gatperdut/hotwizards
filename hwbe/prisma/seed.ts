import { PrismaClient } from '@hw/prismagen/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { Pool } from 'pg';
import { seedUsers } from './seeds/users.seed.js';

const connectionString: string = process.env['HWBE_DB_URL'] as string;

const pool = new Pool({ connectionString: connectionString });

const adapter: PrismaPg = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter: adapter });

async function main(): Promise<void> {
  await seedUsers(prisma);
}

main()
  .then(async (): Promise<void> => {
    await prisma.$disconnect();

    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
