#!/bin/sh
set -e

cd /app/prismagen

if ! status_out=$(pnpm exec prisma migrate status 2>&1); then
  if printf '%s' "$status_out" | grep -q 'not found locally in prisma/migrations'; then
    echo "Squashed migration history detected, resetting database."
    pnpm exec prisma migrate reset --force
  fi
fi

echo "Applying database migrations..."
pnpm run migrate:deploy

echo "Seeding database..."
cd /app/seeds
pnpm run seed

echo "Starting hwbe..."
cd /app/hwbe
exec node dist/hwbe/src/main.js
