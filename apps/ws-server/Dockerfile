# WebSocket Server Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY apps/ws-server/package.json ./apps/ws-server/

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/ws-server/ ./apps/ws-server/
COPY packages/ ./packages/

# Build the application
RUN pnpm run build --filter=ws-server

# Expose port
EXPOSE 8080

# Start the server
CMD ["node", "apps/ws-server/dist/index.js"]
