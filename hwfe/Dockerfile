# Build context is the monorepo root: docker build -f hwfe/Dockerfile .

ARG PNPM_VERSION=11.21.0

# ---- Stage 1: build ----
FROM node:24-slim AS build
ARG PNPM_VERSION
RUN npm install -g pnpm@${PNPM_VERSION}

WORKDIR /app

# Install all dependencies first, so this layer is cached until a manifest changes.
# pnpm needs every workspace's package.json present to validate the lockfile.
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY hwbe/package.json hwbe/
COPY hwfe/package.json hwfe/
COPY shared/package.json shared/
COPY prismagen/package.json prismagen/
RUN pnpm install --frozen-lockfile

COPY tsconfig.json ./
COPY shared/ shared/
COPY prismagen/ prismagen/
# From hwbe only what prisma generate needs, so backend code changes
# don't invalidate this image's build cache.
COPY hwbe/prisma.config.ts hwbe/
COPY hwbe/prisma hwbe/prisma/
COPY hwfe/ hwfe/

# Values baked into the bundle via src/environments/environment.ts placeholders.
ARG HWFE_SENTRY_DSN=
ARG SENTRY_RELEASE=dev
ARG HWFE_HWBE_URL=https://hotwizards.net
ARG PUBLIC_VAPID_KEY=

RUN sed -i "s|HWFE_SENTRY_DSN_PLACEHOLDER|${HWFE_SENTRY_DSN}|" hwfe/src/environments/environment.ts \
  && sed -i "s|HWFE_SENTRY_RELEASE_PLACEHOLDER|${SENTRY_RELEASE}|" hwfe/src/environments/environment.ts \
  && sed -i "s|HWFE_HWBE_URL|${HWFE_HWBE_URL}|" hwfe/src/environments/environment.ts \
  && sed -i "s|HWFE_PUBLIC_VAPID_KEY|${PUBLIC_VAPID_KEY}|" hwfe/src/environments/environment.ts

# prisma.config.ts requires a DB url to load; generate/build never connect, so a dummy works.
ENV HWBE_DB_URL=postgresql://build:build@localhost:5432/build?schema=public

RUN pnpm run hwbe:prisma:gen \
  && pnpm run shared:build \
  && pnpm run hwfe:build

# ---- Stage 2: runtime ----
FROM nginx:1.27-alpine

COPY hwfe/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/hwfe/dist/hwfe/browser /usr/share/nginx/html

EXPOSE 80
