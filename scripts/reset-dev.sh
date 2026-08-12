#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")/.."

echo "Clear build outputs, generated code and node_modules"
pnpm run clear

echo "Installing dependencies from lockfile"
pnpm i

pnpm -w run prismagen:migrate:reset

echo "Wiping database and migration history"
rm -rf prismagen/prisma/migrations
echo 'DROP OWNED BY CURRENT_USER CASCADE;' | pnpm --filter @hw/prismagen db:execute --stdin

echo "Regenerating prisma client"
pnpm -w run prismagen:generate

echo "Creating single initial migration from schema.prisma"
pnpm -w run prismagen:migrate:dev

echo "Seeding database"
pnpm -w run seeds:seed:dev

echo "Done. Remember to commit the regenerated prismagen/prisma/migrations, and do pnpm run reset:prod after deployment."
