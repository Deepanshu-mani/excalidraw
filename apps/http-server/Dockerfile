# HTTP Server Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY apps/http-server/package.json ./apps/http-server/

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/http-server/ ./apps/http-server/
COPY packages/ ./packages/

# Build the application
RUN pnpm run build --filter=http-server

# Expose port
EXPOSE 4000

# Start the server
CMD ["node", "apps/http-server/dist/index.js"]
