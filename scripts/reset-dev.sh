#!/usr/bin/env bash
# Full development environment reset:
#   - wipe all build outputs, generated code and node_modules (lockfile is kept)
#   - fresh install, exactly as pinned by pnpm-lock.yaml
#   - squash migrations and rebuild the database (see reset-schema.sh)
#   - build shared so the dev watches resolve immediately

set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> Cleaning build outputs, generated code and node_modules"
pnpm run clean:all

echo "==> Installing dependencies from lockfile"
pnpm install --frozen-lockfile

./scripts/reset-schema.sh

echo "==> Building shared workspace"
pnpm run shared:build

echo "==> Done. Start developing with: pnpm run hwbe:start / pnpm run hwfe:start"
