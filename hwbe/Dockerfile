ARG PNPM_VERSION=11.21.0

# Stage 1: build
FROM node:24-slim AS build
ARG PNPM_VERSION
RUN npm install -g pnpm@${PNPM_VERSION}

WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY hwbe/package.json hwbe/
COPY shared/package.json shared/
COPY prismagen/package.json prismagen/
RUN pnpm install --frozen-lockfile

COPY tsconfig.json ./
COPY shared/ shared/
COPY prismagen/ prismagen/
COPY hwbe/ hwbe/

ENV HWBE_DB_URL=postgresql://build:build@localhost:5432/build?schema=public

RUN pnpm run prismagen:generate \
  && pnpm run shared:build \
  && pnpm run hwbe:build

# Stage 2: production dependencies for hwbe only
FROM node:24-slim AS deps
ARG PNPM_VERSION
RUN npm install -g pnpm@${PNPM_VERSION}

WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY hwbe/package.json hwbe/
COPY shared/package.json shared/
COPY prismagen/package.json prismagen/

RUN pnpm install --frozen-lockfile --prod --filter @hw/hwbe...

# Stage 3: runtime
FROM node:24-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

COPY --from=deps /app /app

WORKDIR /app

COPY --from=build /app/shared/dist shared/dist/
COPY --from=build /app/prismagen/src prismagen/src/
COPY --from=build /app/hwbe/dist hwbe/dist/
COPY prismagen/adapter-pg.ts prismagen/
COPY prismagen/prisma.config.ts prismagen/
COPY prismagen/prisma prismagen/prisma/

COPY hwbe/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

WORKDIR /app/hwbe

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]
