# 🚀 ExcelDraw Setup

Simple setup for ExcelDraw with centralized configuration.

## Quick Start

### 1. Setup Configuration
```bash
# Automated setup (creates .env with generated JWT secret)
./setup-config.sh
```

### 2. Start Services
```bash
pnpm dev
```

That's it! 🎉

## What the setup script does:

- ✅ Generates a strong JWT secret
- ✅ Creates a single `.env` file with all configuration
- ✅ Sets up database, ports, and API URLs
- ✅ Configures avatar services

## Configuration

All configuration is in the single `.env` file:

```env
# Database
DATABASE_URL=postgresql://postgres:mysecretpassword@localhost/draw-app

# Security (auto-generated)
JWT_SECRET=your-secret-here

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

## Manual Setup (if needed)

If you prefer to create the `.env` file manually:

```bash
# Create .env file
touch .env

# Add the configuration above
# Generate JWT secret:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Architecture

- **Single .env file** - All configuration in one place
- **Centralized config** - `packages/common/src/config.ts` manages everything
- **Re-exports** - Each service imports from the centralized config
- **Type safety** - Full TypeScript support with validation

## Services

- **Frontend**: http://localhost:3000
- **HTTP API**: http://localhost:4000
- **WebSocket**: ws://localhost:8080

## Troubleshooting

- **Database issues**: Check `DATABASE_URL` in `.env`
- **Auth issues**: Ensure `JWT_SECRET` is set
- **Connection issues**: Verify ports match in `.env`

## Security

- ✅ `.env` files are gitignored
- ✅ Strong JWT secrets generated automatically
- ✅ Configuration validation on startup
- ✅ Type-safe configuration access
