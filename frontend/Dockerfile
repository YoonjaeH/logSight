# --- Stage 1: Build ---
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package.json and lock files
COPY package*.json ./

# Install dependencies, using the flag to resolve the conflict
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# --- Stage 2: Production ---
FROM node:18-alpine
WORKDIR /app

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy built assets from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Set the user
USER nextjs

EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]