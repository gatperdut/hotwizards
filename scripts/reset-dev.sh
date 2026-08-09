#!/usr/bin/env bash
# Full development environment reset:
#   - wipe all build outputs, generated code and node_modules (lockfile is kept)
#   - fresh install, exactly as pinned by package-lock.json
#   - squash all prisma migrations into a single "initial" migration
#   - wipe the database, apply the squashed migration, seed
#
# NOTE: squashing rewrites hwbe/prisma/migrations. After committing a squash,
# production's migration history no longer matches; wipe its DB volume once:
#   ssh root@hotwizards.net 'cd /opt/hw && docker compose down && docker volume rm hw_db-data && docker compose up -d'

set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> Cleaning build outputs, generated code and node_modules"
npm run clean:all

echo "==> Installing dependencies from lockfile"
npm ci

echo "==> Squashing migrations: wiping database and migration history"
rm -rf hwbe/prisma/migrations
cd hwbe
npx prisma migrate reset --force --skip-seed --skip-generate

echo "==> Creating single initial migration from schema.prisma"
npx prisma migrate dev --name initial

echo "==> Seeding database"
npx prisma db seed
cd ..

echo "==> Building shared workspace"
npm run shared:build

echo "==> Done. Start developing with: npm run hwbe:start / npm run hwfe:start"
