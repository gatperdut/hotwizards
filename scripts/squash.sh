#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")/.."

echo "Recreating database container from a pristine, empty volume"
pnpm run db:nuke
pnpm run db:up

echo "Squashing: wiping migration history"
rm -rf prismagen/prisma/migrations

echo "Regenerating prisma client"
pnpm -w run prismagen:generate

echo "Creating single initial migration from schema.prisma"
pnpm --filter @hw/prismagen migrate:squash

echo "Seeding database"
pnpm -w run seeds:seed:dev

echo "Done. Commit prismagen/prisma/migrations; the next deploy self-heals prod (entrypoint detects the squash and resets the db)."
