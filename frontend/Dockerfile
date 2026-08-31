# Production container for the frontend.
#
# NOT used by Vercel — Vercel builds Next.js natively and ignores this file.
# It exists so the whole stack can run with one command locally, and so you're
# not locked into Vercel if you ever want to host the frontend elsewhere.
#
# For day-to-day development use `npm run dev` instead: Next.js's own docs
# recommend it over Docker on Mac/Windows, because file watching through a
# bind mount makes hot reload noticeably slower.

# --- Stage 1: install dependencies ---
FROM node:22-alpine AS deps
WORKDIR /app
# Only the lockfiles are copied first, so this layer stays cached unless
# dependencies actually change.
COPY package.json package-lock.json ./
RUN npm ci

# --- Stage 2: build ---
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- Stage 3: run ---
# Starts from a clean image, so build tools and dev dependencies don't ship
# to production. Keeps the final image small.
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000

# Run as a non-root user, so a compromise doesn't get full control of the container.
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# "standalone" contains the server plus only the dependencies it needs.
# public/ and .next/static aren't included in it, so they're copied separately.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# Standalone builds their own minimal server — no `next start` needed.
CMD ["node", "server.js"]
