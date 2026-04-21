# Hot Wizards

## Development notes

### Fully reset application development
* `npm run clean:all`
* `npm i`
* `npm run hwbe:prisma:gen`
* `npm run shared:build`
* Delete `hwbe/prisma/migrations`
* `npm run hwbe:prisma:migrate:reset`
* `npm run hwbe:prisma:migrate:dev`
* `npm run hwbe:prisma:db:seed`
