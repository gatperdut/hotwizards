import 'dotenv/config';
import { PrismaConfig } from 'prisma';

export default {
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env['HWBE_DB_URL'],
  },
} satisfies PrismaConfig;
