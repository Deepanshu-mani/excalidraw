#!/bin/bash

# ExcelDraw Environment Setup Script
echo "🚀 Setting up ExcelDraw environment variables..."

# Generate a strong JWT secret
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))" 2>/dev/null || openssl rand -hex 64)

echo "Generated JWT Secret: $JWT_SECRET"
echo ""

# Create .env files
echo "📝 Creating environment files..."

# HTTP Server .env
cat > apps/http-server/.env << EOF
# Database
DATABASE_URL=postgresql://postgres:mysecretpassword@localhost/draw-app

# JWT Secret
JWT_SECRET=$JWT_SECRET

# Server Port
HTTP_PORT=4000
EOF

# WebSocket Server .env
cat > apps/ws-server/.env << EOF
# JWT Secret (must match HTTP server)
JWT_SECRET=$JWT_SECRET

# WebSocket Server Port
WS_PORT=8080
EOF

# Frontend .env.local
cat > apps/exceldraw-frontend/.env.local << EOF
# Backend API URL
NEXT_PUBLIC_HTTP_BACKEND=http://localhost:4000/api/v1

# WebSocket URL
NEXT_PUBLIC_WS_URL=ws://localhost:8080

# Avatar Services
NEXT_PUBLIC_AVATAR_PRIMARY_URL=https://avatar.iran.liara.run/public
NEXT_PUBLIC_AVATAR_FALLBACK_URL=https://ui-avatars.com/api
EOF

echo "✅ Environment files created successfully!"
echo ""
echo "📁 Files created:"
echo "   - apps/http-server/.env"
echo "   - apps/ws-server/.env"
echo "   - apps/exceldraw-frontend/.env.local"
echo ""
echo "🔧 Next steps:"
echo "   1. Update DATABASE_URL in apps/http-server/.env if needed"
echo "   2. Restart all services to load new environment variables"
echo "   3. Run: pnpm dev"
echo ""
echo "⚠️  Remember: Never commit .env files to version control!"
