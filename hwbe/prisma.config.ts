import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

console.log(process.env);

console.log(env('HWBE_DB_URL'));

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env['HWBE_DB_URL'],
  },
});
