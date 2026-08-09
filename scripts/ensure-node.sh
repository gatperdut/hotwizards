# Sourced by the reset scripts: makes sure the node version from .nvmrc is
# active. Tries to switch via nvm; aborts with a clear message otherwise.
# (A wrong node version doesn't fail loudly — prisma/tsx die halfway through
# a reset instead, leaving a half-reset environment.)

required="$(cat "$(dirname "${BASH_SOURCE[0]}")/../.nvmrc")"
required_major="${required%%.*}"
current_major="$(node -v 2>/dev/null | sed 's/^v//;s/\..*//' || true)"

if [ "$current_major" != "$required_major" ]; then
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  if [ -s "$NVM_DIR/nvm.sh" ]; then
    . "$NVM_DIR/nvm.sh"
    nvm use "$required" > /dev/null 2>&1 || true
    current_major="$(node -v 2>/dev/null | sed 's/^v//;s/\..*//' || true)"
  fi
fi

if [ "$current_major" != "$required_major" ]; then
  echo "Node v${required} required, found $(node -v 2>/dev/null || echo 'none'). Run: nvm use"
  exit 1
fi
