# Hot Wizards Backend

## Development notes

### DTO vs interface vs type
* `DTO`: for communication between HWBE & HWFE that needs class-validator or class-transformer. `@hw/shared`.
* `interface`: for communication between HWBE & HWFE that does not need class-validator. `@hw/shared`.
* `type`: communication within each of HWBE & HWFE, but not with one another.

### Fully reset database development
* `npm run prismagen:clean`
* `npm run hwbe:prisma:gen`
* `npm run hwbe:prisma:migrate:reset`
* `npm run hwbe:prisma:migrate:dev`
* `npm run hwbe:prisma:db:seed`

### Fully reset database droplet
* `ssh root@hotwizards.net`
* `sudo -u postgres psql`
* Run:
  ```
  SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'hwbe' AND pid <> pg_backend_pid();
  DROP DATABASE IF EXISTS hwbe;
  CREATE DATABASE hwbe OWNER hwbeuser;
  \c hwbe;
  ALTER SCHEMA public OWNER TO hwbeuser;
  GRANT ALL ON SCHEMA public TO hwbeuser;
  ```