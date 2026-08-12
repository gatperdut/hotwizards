ARG PNPM_VERSION=11.21.0

# Stage 1: build
FROM node:24-slim AS build
ARG PNPM_VERSION
RUN npm install -g pnpm@${PNPM_VERSION}

WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY hwfe/package.json hwfe/
COPY shared/package.json shared/
COPY prismagen/package.json prismagen/
RUN pnpm install --frozen-lockfile

COPY tsconfig.json ./
COPY shared/ shared/
COPY prismagen/ prismagen/
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

ENV HWBE_DB_URL=postgresql://build:build@localhost:5432/build?schema=public

RUN pnpm run prismagen:generate \
  && pnpm run shared:build \
  && pnpm run hwfe:build

# Stage 2: runtime
FROM nginx:1.27-alpine

COPY hwfe/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/hwfe/dist/hwfe/browser /usr/share/nginx/html

EXPOSE 80
