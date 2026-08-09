#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")/../hwbe"

echo "Wiping database and migration history"
rm -rf prisma/migrations
echo 'DROP OWNED BY CURRENT_USER CASCADE;' | npx prisma db execute --stdin

echo "Regenerating prisma client"
npx prisma generate

echo "Creating single initial migration from schema.prisma"
npx prisma migrate dev --name initial

echo "Seeding database"
npx prisma db seed

echo "Done. Remember to commit the regenerated hwbe/prisma/migrations."
