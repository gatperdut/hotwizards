import 'dotenv/config';
import { PrismaConfig } from 'prisma';

const seedFile =
  process.env['HWBE_NODE_ENV'] === 'development' ? 'prisma/dev.seed.ts' : 'prisma/prod.seed.ts';

export default {
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: `tsx ${seedFile}`,
  },
  datasource: {
    url: process.env['HWBE_DB_URL'],
  },
} satisfies PrismaConfig;
