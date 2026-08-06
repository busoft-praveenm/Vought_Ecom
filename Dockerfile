# Stage 1: Build
FROM node:24-alpine AS builder
WORKDIR /app

# Install dependencies (including dev deps for building)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN yarn prisma generate

# Build the application
RUN yarn build

# Stage 2: Runner
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Install only production dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

# Copy built application and prisma
COPY --from=builder /app/dist ./dist
# We need prisma schema and generated client for runtime queries (and potentially migrations)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

# Add a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

EXPOSE 3001
ENV PORT 3001

CMD ["node", "dist/main"]
