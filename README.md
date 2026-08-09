# Hot Wizards

## Development notes

- Deal with `as unknown`?
- Deal with pixi `.on()`?
- Are the dialogs being pulled in by the imports anyway, despite the lazy loading?

### Resetting

From lightest to heaviest:

- `pnpm run reset:db`: wipe and reseed the database, keeping the existing migrations.
- `pnpm run reset:schema`: wipe the database and migration history after schema changes, derive a single `initial` migration from the current `schema.prisma`, and seed.
- `pnpm run reset:dev`: full environment reset: clean everything, fresh `pnpm install --frozen-lockfile`, then `reset:schema`, then build `shared`.

After a squash lands on `master` and has been deployed, production's migration history no longer matches. Wipe its DB volume once with `pnpm run reset:prod` (asks for confirmation, then waits until the backend is back up. expect ~1 minute of downtime).
