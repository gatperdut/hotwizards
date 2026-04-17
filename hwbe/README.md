# Hot Wizards Backend

## Development notes

### DTO vs interface vs type
* `DTO`: for communication between HWBE & HWFE that needs class-validator or class-transformer. `@hw/shared`.
* `interface`: for communication between HWBE & HWFE that does not need class-validator. `@hw/shared`.
* `type`: communication within each of HWBE & HWFE, but not with one another.

### Fully reset database
* `npm run prismagen:clean`
* `npm run hwbe:prisma:gen`
* `npm run hwbe:prisma:migrate:reset`
* `npm run hwbe:prisma:migrate:dev`
* `npm run hwbe:prisma:db:seed`