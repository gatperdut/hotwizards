import { config } from 'dotenv';
import { PrismaConfig } from 'prisma';

config({ path: ['.env', '../hwbe/.env'] });

export default {
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env['HWBE_DB_URL'],
  },
} satisfies PrismaConfig;
