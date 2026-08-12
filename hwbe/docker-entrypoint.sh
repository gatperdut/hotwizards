#!/bin/sh
set -e

echo "Applying database migrations..."
cd /app/prismagen
npx prisma migrate deploy

echo "Seeding database..."
if [ "$HWBE_NODE_ENV" = "development" ]; then
  npx tsx prisma/dev.seed.ts
else
  npx tsx prisma/prod.seed.ts
fi

echo "Starting hwbe..."
cd /app/hwbe
exec node dist/hwbe/src/main.js
