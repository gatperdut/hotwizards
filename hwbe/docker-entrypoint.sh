#!/bin/sh
set -e

echo "Applying database migrations..."
npx prisma migrate deploy

echo "Seeding database..."
npx prisma db seed

echo "Starting hwbe..."
exec node dist/hwbe/src/main.js
