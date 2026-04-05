import 'dotenv/config';
import type { PrismaConfig } from 'prisma';
import { env } from 'prisma/config';

console.log(process.env);
console.log('THIS ONE', process.env['HWBE_DB_URL']);

console.log('env obj', env('HWBE_DB_URL'));

export default {
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env['HWBE_DB_URL'],
  },
} satisfies PrismaConfig;
