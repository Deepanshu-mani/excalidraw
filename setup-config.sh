#!/bin/bash

# ExcelDraw - Simple Configuration Setup
echo "🚀 Setting up ExcelDraw configuration..."

# Generate a strong JWT secret
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))" 2>/dev/null || openssl rand -hex 64)

echo "Generated JWT Secret: $JWT_SECRET"
echo ""

# Create .env file
echo "📝 Creating .env file..."

cat > .env << EOF
# ExcelDraw Configuration
# Generated on $(date)

# Database
DATABASE_URL=postgresql://postgres:mysecretpassword@localhost/draw-app

# Security
JWT_SECRET=$JWT_SECRET

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
EOF

echo "✅ .env file created successfully!"
echo ""
echo "🔧 Next steps:"
echo "   1. Update DATABASE_URL in .env if needed"
echo "   2. Run: pnpm dev"
echo ""
echo "📖 All services use centralized configuration from @repo/common/config"
echo "⚠️  Remember: Never commit .env files to version control!"
