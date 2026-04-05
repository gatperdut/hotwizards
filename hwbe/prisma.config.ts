import 'dotenv/config';
import type { PrismaConfig } from 'prisma';

const config: PrismaConfig = {
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env['HWBE_DB_URL'],
  },
};

console.log(config);

export default config satisfies PrismaConfig;
