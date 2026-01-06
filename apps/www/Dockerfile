FROM node:20-slim as base

FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app

ARG PUBLIC_STRAPI_URL
ARG PUBLIC_STRAPI_API_TOKEN

ENV PUBLIC_STRAPI_URL=${PUBLIC_STRAPI_URL}
ENV PUBLIC_STRAPI_API_TOKEN=${PUBLIC_STRAPI_API_TOKEN}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm install -g pnpm

RUN pnpm build

FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs && \
    npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 4321

USER nodejs

CMD ["serve", "-s", "dist", "-l", "4321"]
