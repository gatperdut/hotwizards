# Hot Wizards

## Development notes

- Deal with `as unknown`?
- Deal with pixi `.on()`?
- Are the dialogs being pulled in by the imports anyway, despite the lazy loading?

### Local development

```
nvm install && nvm use
corepack enable
pnpm install
cp hwbe/.env.example hwbe/.env        # fill in DB URL, JWT key, VAPID keys
docker compose up -d db               # or point HWBE_DB_URL at any postgres
pnpm run prismagen:generate           # generates prismagen/src (gitignored)
pnpm run shared:start
pnpm run prismagen:migrate:deploy     # apply committed migrations
pnpm run prismagen:seed               # dev seed (HWBE_NODE_ENV=development)
pnpm run hwbe:start
pnpm run hwfe:start
```

### Resetting data

From lightest to heaviest:

- `pnpm run reset:dev:db`: wipe and reseed the database, keeping the existing migrations.
- `pnpm run reset:dev:schema`: wipe the database and migration history after schema changes, derive a single `initial` migration from the current `schema.prisma`, and seed.
- `pnpm run reset:dev`: full environment reset: clean everything, fresh `pnpm install --frozen-lockfile`, then `reset:schema`, then build `shared`.

After a squash lands on `master` and has been deployed, production's migration history no longer matches. Wipe its DB volume once with `pnpm run reset:prod` (asks for confirmation, then waits until the backend is back up. expect ~1 minute of downtime).
