#!/bin/sh
set -e

echo "Applying database migrations..."
cd /app/prismagen
pnpm run migrate:deploy

echo "Seeding database..."
cd /app/seeds
pnpm run seed

echo "Starting hwbe..."
cd /app/hwbe
exec node dist/hwbe/src/main.js
