#!/bin/sh
set -e

echo "Applying database migrations..."
npx prisma migrate deploy --config /app/prismagen/prisma.config.ts

echo "Seeding database..."
if [ "$HWBE_NODE_ENV" = "development" ]; then
  npx tsx /app/hwbe/prisma/dev.seed.ts
else
  npx tsx /app/hwbe/prisma/prod.seed.ts
fi

echo "Starting hwbe..."
exec node dist/hwbe/src/main.js
