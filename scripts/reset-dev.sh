#!/usr/bin/env bash
# Full development environment reset:
#   - wipe all build outputs, generated code and node_modules (lockfile is kept)
#   - fresh install, exactly as pinned by package-lock.json
#   - squash migrations and rebuild the database (see reset-schema.sh)
#   - build shared so the dev watches resolve immediately

set -euo pipefail
. "$(dirname "$0")/ensure-node.sh"
cd "$(dirname "$0")/.."

echo "==> Cleaning build outputs, generated code and node_modules"
npm run clean:all

echo "==> Installing dependencies from lockfile"
npm ci

./scripts/reset-schema.sh

echo "==> Building shared workspace"
npm run shared:build

echo "==> Done. Start developing with: npm run hwbe:start / npm run hwfe:start"
