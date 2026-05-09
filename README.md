# Hot Wizards

## Development notes

- Deal with `as unknown`?
- Deal with pixi `.on()`?
- Are the dialogs being pulled in by the imports anyway, despite the lazy loading?

### Fully reset application development

- `npm run clean:all`
- `npm i`
- `npm run hwbe:prisma:gen`
- `npm run shared:build`
- Delete `hwbe/prisma/migrations`
- `npm run hwbe:prisma:migrate:reset`
- `npm run hwbe:prisma:migrate:dev`
- `npm run hwbe:prisma:db:seed`
