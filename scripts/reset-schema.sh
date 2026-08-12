#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")/../hwbe"

CONFIG=../prismagen/prisma.config.ts

echo "Wiping database and migration history"
rm -rf ../prismagen/prisma/migrations
echo 'DROP OWNED BY CURRENT_USER CASCADE;' | npx prisma db execute --config "$CONFIG" --stdin

echo "Regenerating prisma client"
npx prisma generate --config "$CONFIG"

echo "Creating single initial migration from schema.prisma"
npx prisma migrate dev --config "$CONFIG" --name initial

echo "Seeding database"
npx tsx prisma/dev.seed.ts

echo "Done. Remember to commit the regenerated prismagen/prisma/migrations."
