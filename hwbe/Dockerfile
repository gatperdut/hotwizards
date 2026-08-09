# Build context is the monorepo root: docker build -f hwbe/Dockerfile .

# ---- Stage 1: build ----
FROM node:24-slim AS build

WORKDIR /app

# Install all dependencies first, so this layer is cached until a package.json changes.
COPY package.json package-lock.json ./
COPY hwbe/package.json hwbe/
COPY hwfe/package.json hwfe/
COPY shared/package.json shared/
COPY prismagen/package.json prismagen/
RUN npm ci

COPY tsconfig.json ./
COPY shared/ shared/
COPY prismagen/ prismagen/
COPY hwbe/ hwbe/

# prisma.config.ts requires a DB url to load; generate/build never connect, so a dummy works.
ENV HWBE_DB_URL=postgresql://build:build@localhost:5432/build?schema=public

RUN npm run hwbe:prisma:gen \
  && npm run shared:build \
  && npm run hwbe:build

# ---- Stage 2: production dependencies only ----
FROM node:24-slim AS deps

WORKDIR /app

COPY package.json package-lock.json ./
COPY hwbe/package.json hwbe/
COPY hwfe/package.json hwfe/
COPY shared/package.json shared/
COPY prismagen/package.json prismagen/
RUN npm ci --omit=dev

# ---- Stage 3: runtime ----
FROM node:24-slim

# Prisma's CLI needs openssl, which node:24-slim does not ship.
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

WORKDIR /app

COPY --from=deps /app/node_modules node_modules/
COPY package.json package-lock.json ./

# Workspace packages: the node_modules/@hw/* symlinks point at these directories.
COPY shared/package.json shared/
COPY --from=build /app/shared/dist shared/dist/
COPY prismagen/package.json prismagen/
COPY --from=build /app/prismagen/src prismagen/src/

COPY hwbe/package.json hwbe/prisma.config.ts hwbe/
COPY hwbe/prisma hwbe/prisma/
COPY --from=build /app/hwbe/dist hwbe/dist/

COPY hwbe/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

WORKDIR /app/hwbe

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]
