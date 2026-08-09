#!/usr/bin/env bash
# Wipe the PRODUCTION database volume and rebuild it from the deployed images
# (migrations + seed run in the hwbe entrypoint on startup).
#
# Needed once after a migration squash (reset:schema / reset:dev) lands on
# master and has been deployed. Expect ~1 minute of downtime while postgres
# reinitializes and hwbe migrates, seeds and boots.

set -euo pipefail

echo "This WIPES the production database at hotwizards.net and rebuilds it from migrations + seed."
read -r -p "Type 'wipe' to continue: " answer
[ "$answer" = "wipe" ] || { echo "Aborted."; exit 1; }

ssh root@hotwizards.net 'cd /opt/hw && docker compose down && docker volume rm hw_db-data && docker compose up -d'

echo "==> Stack restarting; waiting for the API to come back (~1 min)"
for i in $(seq 1 30); do
  # 401 = backend is up and answering (endpoint requires auth); 5xx = still booting
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 https://hotwizards.net/api/adventure-templates || true)
  if [ "$code" = "401" ]; then
    echo "==> Backend is up and migrated (waited ~$((i * 5))s)."
    exit 0
  fi
  sleep 5
done

echo "==> Backend still not answering after 150s. Inspect with:"
echo "    ssh root@hotwizards.net 'cd /opt/hw && docker compose logs hwbe --tail 50'"
exit 1
