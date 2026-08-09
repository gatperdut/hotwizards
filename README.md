# Hot Wizards

## Development notes

- Deal with `as unknown`?
- Deal with pixi `.on()`?
- Are the dialogs being pulled in by the imports anyway, despite the lazy loading?

### Resetting

Three tiers, from lightest to heaviest:

- `npm run reset:db` — wipe and reseed the database, keeping the existing migrations. For when the dev *data* is in a bad state.
- `npm run reset:schema` — squash migrations: wipe the database and migration history, derive a single `initial` migration from the current `schema.prisma`, seed. For after schema changes. Commit the regenerated `hwbe/prisma/migrations`.
- `npm run reset:dev` — full environment reset: clean everything, fresh `npm ci`, then `reset:schema`, then build `shared`.

After a squash lands on `master`, production's migration history no longer matches; wipe its DB volume once:

```sh
ssh root@hotwizards.net 'cd /opt/hw && docker compose down && docker volume rm hw_db-data && docker compose up -d'
```
