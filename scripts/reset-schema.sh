#!/usr/bin/env bash
# Squash migrations and rebuild the database from the current schema:
#   - delete all prisma migrations
#   - wipe the database
#   - create and apply a single "initial" migration derived from schema.prisma
#   - seed
#
# Use this after modifying the prisma schema, when you don't care about
# migration history (single squashed migration policy).
#
# NOTE: this is not reset:db. The wipe here must not re-apply migrations or
# seed (there is no schema yet at that point), so it drops the schema directly;
# reset:db interactively re-applies the existing migrations + seeds.
#
# After a squash lands on master and deploys, production's migration history
# no longer matches; wipe its DB volume once with: npm run reset:prod

set -euo pipefail
cd "$(dirname "$0")/../hwbe"

echo "==> Wiping database and migration history"
rm -rf prisma/migrations
# Drops every object the app user owns (tables, sequences, types) without
# requiring ownership of the public schema itself.
echo 'DROP OWNED BY CURRENT_USER CASCADE;' | npx prisma db execute --stdin

echo "==> Regenerating prisma client"
npx prisma generate

echo "==> Creating single initial migration from schema.prisma"
npx prisma migrate dev --name initial

echo "==> Seeding database"
npx prisma db seed

echo "==> Done. Remember to commit the regenerated hwbe/prisma/migrations."
