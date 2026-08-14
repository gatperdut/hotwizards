# Hot Wizards

## Local development

Required: `docker-compose`, plus `node` and `pnpm` as pinned by `engines` / `packageManager` in the root `package.json`.

2 compose files:

- `docker-compose.yml` (**production**): copied verbatim to the droplet by the deploy workflow.
- `docker-compose.dev.yml` (**development**): runs only postgres; hwbe/hwfe run on the host via pnpm.

Quickstart:

```sh
cp hwbe/.env.example hwbe/.env # fill JWT/VAPID keys
pnpm i
pnpm run db:up
pnpm run prismagen:generate
pnpm run prismagen:migrate:dev
pnpm run seeds:seed:dev
pnpm run shared:build
pnpm run hwbe:start
pnpm run hwfe:start
```

Database scripts:

- `pnpm run db:up`: start the db container, block until the healthcheck passes.
- `pnpm run db:down`: stop and remove the container; the data volume survives.
- `pnpm run db:nuke`: same, but also delete the data volume (fresh on next `db:up`).
- `pnpm run db:logs`: postgres logs
- `pnpm run db:psql`: open a psql shell inside the container.

## Development notes

- Deal with `as unknown`?
- Deal with pixi `.on()`?
- Are the dialogs being pulled in by the imports anyway, despite the lazy loading?
