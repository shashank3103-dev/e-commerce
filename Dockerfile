# --------------------
# Base image
# --------------------
FROM node:18-alpine AS base

# Set work directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies
RUN npm install

# --------------------
# Build stage
# --------------------
FROM base AS build

# Copy the rest of the source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the app (compile TS -> JS, if using TypeScript)
# If you're using ts-node for dev, you can skip this
RUN npm run build

# --------------------
# Production stage
# --------------------
FROM node:18-alpine AS production

WORKDIR /usr/src/app

# Copy only package.json (no lockfile needed in production)
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built code + prisma schema and generated client
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma

# Ensure Prisma client works
RUN npx prisma generate

# Expose API port
EXPOSE 5000

# Start app with Node (dist/server.js must exist after build)
CMD ["node", "dist/server.js"]