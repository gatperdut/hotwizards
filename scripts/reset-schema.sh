#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")/../prismagen"

echo "Wiping database and migration history"
rm -rf prisma/migrations
echo 'DROP OWNED BY CURRENT_USER CASCADE;' | npx prisma db execute --stdin

echo "Regenerating prisma client"
pnpm run generate

echo "Creating single initial migration from schema.prisma"
pnpm run migrate:dev -- --name initial

echo "Seeding database"
pnpm run seed:dev

echo "Done. Remember to commit the regenerated prismagen/prisma/migrations."
