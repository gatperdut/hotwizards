import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaClient } from './generated/client';
import { seedUsers } from './seeds/users.seed';

const connectiongString: string = `${process.env['HWBE_DB_URL']}`;

const pool = new Pool({ connectionString: connectiongString });

const adapter: PrismaPg = new PrismaPg({ connectionString: connectiongString });

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
