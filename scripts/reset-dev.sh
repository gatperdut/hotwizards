#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> Cleaning build outputs, generated code and node_modules"
pnpm run clean:all

echo "Installing dependencies from lockfile"
pnpm install --frozen-lockfile

./scripts/reset-schema.sh

