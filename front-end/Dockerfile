FROM node:20-slim as base

FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm install -g pnpm

RUN pnpm build

FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs && \
    npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

USER nodejs

CMD ["serve", "-s", "dist", "-l", "3000"]
