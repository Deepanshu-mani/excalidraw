# Simple Configuration Setup

This guide explains how to set up the configuration for ExcelDraw.

## 🎯 Simple Configuration

ExcelDraw uses a **centralized configuration system** where all environment variables are managed in one place and imported where needed.

### Single Configuration File

All configuration is managed through a single `.env` file at the project root:

#### `.env` (Root Directory)

```env
# ExcelDraw Configuration

# Database
DATABASE_URL=postgresql://postgres:mysecretpassword@localhost/draw-app

# Security
JWT_SECRET=your-super-secret-jwt-key-here

# Server Ports
HTTP_PORT=4000
WS_PORT=8080

# Frontend URLs
NEXT_PUBLIC_HTTP_BACKEND=http://localhost:4000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8080

# Avatar Services
NEXT_PUBLIC_AVATAR_PRIMARY_URL=https://avatar.iran.liara.run/public
NEXT_PUBLIC_AVATAR_FALLBACK_URL=https://ui-avatars.com/api

# App Settings
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
```

## Setup Instructions

### Option 1: Automated Setup (Recommended)

```bash
# Run the setup script
./setup-config.sh
```

### Option 2: Manual Setup

```bash
# Create .env file manually
touch .env
# Then add the configuration values from above
```

2. **Update the values in .env file:**
   - Change `JWT_SECRET` to a strong, random secret
   - Update `DATABASE_URL` if using different database credentials
   - Modify ports if needed (default: HTTP=4000, WS=8080)

3. **Generate a strong JWT secret:**

   ```bash
   # Option 1: Using Node.js
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

   # Option 2: Using openssl
   openssl rand -hex 64
   ```

## 🏗️ Centralized Architecture

### How It Works

1. **Single Source of Truth**: All configuration is defined in `packages/common/src/config.ts`
2. **Environment Variables**: The config reads from a single `.env` file at the project root
3. **Re-exports**: Each service imports from the centralized config:
   - `packages/backend-common/src/config.ts` → re-exports from `@repo/common/config`
   - `apps/exceldraw-frontend/config.ts` → re-exports from `@repo/common/config`

### Configuration Structure

```typescript
// packages/common/src/config.ts
export const config = {
  database: { url: DATABASE_URL },
  jwt: { secret: JWT_SECRET },
  ports: { http: HTTP_PORT, ws: WS_PORT },
  urls: { httpBackend: HTTP_BACKEND, wsUrl: WS_URL },
  avatars: { primary: AVATAR_PRIMARY_URL, fallback: AVATAR_FALLBACK_URL },
  app: {
    nodeEnv: NODE_ENV,
    isProduction: IS_PRODUCTION,
    corsOrigin: CORS_ORIGIN,
    logLevel: LOG_LEVEL,
  },
} as const;
```

### Benefits

- ✅ **Single .env file** to manage
- ✅ **Consistent configuration** across all services
- ✅ **Type safety** with TypeScript
- ✅ **Validation** on startup
- ✅ **Easy production deployment**
- ✅ **No configuration drift** between services

## Production Considerations

- **Never commit .env files to version control**
- Use different JWT secrets for different environments
- Use environment-specific database URLs
- Consider using a secrets management service for production
- Update CORS settings for production domains
- Use `env.production` template for production setup

## Default Values

If environment variables are not set, the application will use these defaults:

- `HTTP_PORT`: 4000
- `WS_PORT`: 8080
- `DATABASE_URL`: postgresql://postgres:mysecretpassword@localhost/draw-app
- `JWT_SECRET`: adsfasdfadf (⚠️ Change this!)
- `NEXT_PUBLIC_HTTP_BACKEND`: http://localhost:4000/api/v1
- `NEXT_PUBLIC_WS_URL`: ws://localhost:8080
- `NEXT_PUBLIC_AVATAR_PRIMARY_URL`: https://avatar.iran.liara.run/public
- `NEXT_PUBLIC_AVATAR_FALLBACK_URL`: https://ui-avatars.com/api

## Verification

After setting up the environment variables:

1. Restart all services
2. Check that the application connects to the correct database
3. Verify that authentication works
4. Test WebSocket connections
5. Confirm avatar loading works

## Troubleshooting

- **Database connection issues**: Check `DATABASE_URL` format and credentials
- **Authentication failures**: Ensure `JWT_SECRET` is the same across all services
- **CORS errors**: Verify `NEXT_PUBLIC_HTTP_BACKEND` matches your HTTP server
- **WebSocket connection issues**: Check `NEXT_PUBLIC_WS_URL` matches your WS server
